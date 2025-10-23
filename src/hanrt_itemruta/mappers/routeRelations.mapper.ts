import { TareaRawPlanning } from 'src/hanrt_tareasplan/types';
import { ItemRutaRaw } from '../interfaces';
import { ContactRawPlanning } from 'src/contacts/interface';
import { AccountRawPlanning } from 'src/accounts/interface';
import { ContactPlanningDto } from 'src/contacts/dto';
import { AccountPlanningDto } from 'src/accounts/dto';
import { mapContactRawToPlanningContactDto } from 'src/contacts/mappers/contact-planning.mapper';
import { mapAccountRawToAccountPlanningDto } from 'src/accounts/mappers/account-planning.mapper';
import { ReglaTareasPlanningDto } from 'src/hanrt_tareasplan/dto/hanrt_tarea-planning.dto';
import {
  mapReglaRawReglaTareaPlanningDto,
  mapTaskRawToTaskPlanningDto,
} from 'src/hanrt_tareasplan/mappers/tarea-regla-planning.mapper';
import { RoutePlanningDto } from '../dto';
import { toUTC4 } from 'src/helpers';
import { IEntregaProductPlanningResult } from 'src/hane_entregas/interface';
import { EntregaPlanningDto } from 'src/hane_entregas/dto';
import {
  mapEntregaResultToEntregaDto,
  mapProductEntregaToProductDto,
} from 'src/hane_entregas/mappers/entrega-product.mapper';

export const mapDataRelationsForEachRoute = (routeRelations: {
  routes: ItemRutaRaw[];
  tasks: TareaRawPlanning[];
  contacts: ContactRawPlanning[];
  accounts: AccountRawPlanning[];
}): RoutePlanningDto[] => {
  const { routes, tasks, contacts, accounts } = routeRelations;
  const routeRulesByRouteId: Record<
    string,
    Record<string, ReglaTareasPlanningDto>
  > = {};
  const contactByRouteId: Record<string, ContactPlanningDto> = {};
  const accountByRouteId: Record<string, AccountPlanningDto> = {};
  contacts.forEach((contactRaw: ContactRawPlanning) => {
    contactByRouteId[contactRaw.ruta_id] =
      mapContactRawToPlanningContactDto(contactRaw);
  });
  accounts.forEach((accountRaw: AccountRawPlanning) => {
    accountByRouteId[accountRaw.ruta_id] =
      mapAccountRawToAccountPlanningDto(accountRaw);
  });

  tasks.forEach((taskRaw: TareaRawPlanning) => {
    const taskDto = mapTaskRawToTaskPlanningDto(taskRaw);
    const rulesForRoute = routeRulesByRouteId[taskRaw.ruta_id] ?? null;
    if (rulesForRoute === null) {
      routeRulesByRouteId[taskRaw.ruta_id] = {
        [taskRaw.regla_id]: mapReglaRawReglaTareaPlanningDto(taskRaw, [
          taskDto,
        ]),
      };
    } else {
      if (!rulesForRoute[taskRaw.regla_id])
        rulesForRoute[taskRaw.regla_id] = mapReglaRawReglaTareaPlanningDto(
          taskRaw,
          [],
        );

      const ruleWithTasks = rulesForRoute[taskRaw.regla_id];
      ruleWithTasks.tareas.push(taskDto);
    }
  });

  return routes.map((route: ItemRutaRaw): RoutePlanningDto => {
    const rulesForRoute: ReglaTareasPlanningDto[] = routeRulesByRouteId[route.ID]
      ? Object.values(routeRulesByRouteId[route.ID])
      : [];

    return {
      id: route.ID,
      tipoVisita: route.tipo_visita_label,
      tipoVisitaId: route.tipo_visita_c,
      assignedUser: route.assigned_user,
      assignedUserId: route.assigned_user_id,
      secuencia: Number(route.secuencia_c || 0),
      duracion: toUTC4(route.duracion_c, 'HH:mm'),
      fechaInicio: toUTC4(route.fecha_inicio_c, 'DD-MM-YYYY'),
      fechaFin: toUTC4(route.fecha_fin_c, 'DD-MM-YYYY'),
      horaInicio: toUTC4(route.hora_inicio_c, 'HH:mm'),
      horaFin: toUTC4(route.hora_fin_c, 'HH:mm'),
      latitud: route.latitud,
      longitud: route.longitud,
      name: route.ruta_name,
      nroVisita: Number(route.nro_visita_c || 0),
      visitaId: route.visita_id,
      visitaNombre: route.visita_nombre,
      visitaEstado: route.visita_estado,
      visitasCiclo: route.visita_ciclo_c,
      visitaHanaVisitasId: route.hana_visitas_id_c,
      qtyTasks: route.qtyTasks,
      tareasRegla: rulesForRoute,
      account: accountByRouteId[route.ID] ?? null,
      contact: contactByRouteId[route.ID] ?? null,
    };
  });
};

export const mapEntregasProdResultToEntregasPlanning = (
  data: IEntregaProductPlanningResult[],
): EntregaPlanningDto[] => {
  const entregasMapped: Record<string, EntregaPlanningDto> = {};
  data.forEach((row: IEntregaProductPlanningResult) => {
    const entrega = entregasMapped[row.entrega_id] ?? null;
    const product = mapProductEntregaToProductDto(row);
    if (entrega) {
      entrega.products.push(product);
    } else {
      const entregaMapped = mapEntregaResultToEntregaDto(row);
      entregaMapped.products = [product];
      entregasMapped[row.entrega_id] = entregaMapped;
    }
  });
  return Object.values(entregasMapped);
};
