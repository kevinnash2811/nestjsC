import { CreatePlanificadorDto, PlanificadorHeaderDto } from "../dto";
import { IPlanningHeaderResult } from "../interface";

export const DBResponseToPlanningHeader = (resp: IPlanningHeaderResult): PlanificadorHeaderDto => {
  return {
    amercado: resp.amercado,
    idamercado: resp.idamercado_c,
    canal: resp.canal_c,
    description: resp.descripcion,
    division: resp.division,
    iddivision: resp.iddivision_c,
    state: resp.estado,
    estadoValorCiclo: resp.estadoValorCiclo,
    fechaCreacion: resp.fecha_creacion,
    cycleEndDate: resp.fechaFinCiclo,
    fechaFin: resp.fecha_fin_c,
    cycleStartDate: resp.fechaInicioCiclo,
    fechaInicio: resp.fecha_inicio_c,
    cycleHoursDay: resp.horasPorDiaCiclo,
    id: resp.id,
    cycleId: resp.idCiclo,
    name: resp.name,
    cycleName: resp.nameCiclo,
    region: resp.regional,
    regionId: resp.region_c,
    tipoId: resp.tipo,
    tipo: resp.tipo_label,
    cantidadVisitasDiaCiclo: resp.cantidadVisitasDiaCiclo,
    cycleDays: resp.diasCiclo,
    stateId: resp.estado_planificacion_c,
    cycleState: resp.estadoCiclo,
  }
}

export const DBResponseToPlanningCreateDto = (resp: IPlanningHeaderResult, name: string): CreatePlanificadorDto => {
  return {
    name: name,
    description: resp.descripcion,
    cycleId: resp.idCiclo,
    state: 'EP01', // En preparacion
    fechaInicio: resp.fecha_inicio_c,
    tipo: resp.tipo,
    userId: resp.assigned_user_id,
    canal: resp.canal_c ?? undefined,
    fechaFin: resp.fecha_fin_c,
    idamercado: resp.idamercado_c ?? undefined,
    iddivision: resp.iddivision_c ?? undefined,
    region: resp.region_c ?? undefined,
  }
}