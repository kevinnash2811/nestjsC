import { HttpException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';
import * as querySQL from '../SQL';
import * as loadash from 'lodash'
import moment from 'moment';
import { ClientException } from 'src/hanrt_planificador/helpers/client-exceptions.helper';
import { HanrtItemRutaRepository } from '../repository/itemruta.repository';
import { mapDataRelationsForEachRoute, mapEntregasProdResultToEntregasPlanning } from '../mappers/routeRelations.mapper';
import { RoutePlanningDto } from '../dto';
import { EntregaPlanningDto } from 'src/hane_entregas/dto';
import { mapVisitDetailsByRouteId } from '../mappers/visitDetailQueryMapper';
@Injectable()
export class ItemRutaGetService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly routeRepo: HanrtItemRutaRepository,
  ) {}

  async getItemRuta(
    fechainiplan_c: string,
    fechafinplan_c: string,
    assigned_user_id: string,
    ciclo_id: string,
  ) {
    try {
      const query = querySQL.items.Get_ItemRuta(
        fechainiplan_c,
        fechafinplan_c,
        assigned_user_id,
        ciclo_id,
      );
      const data = await this.mssqlEntityManager.query(query);

      const groupedData = data.reduce((acc, item) => {
        const key = item.id;
        if (!acc[key]) {
          acc[key] = { ...item, tasks: [] };
        }

        if (item.task_id) {
          acc[key].tasks.push({
            id: item.task_id,
            name: item.task_name,
            description: item.task_description,
            iddivision_c: item.task_iddivision_c,
            // division: item.task_division,
            idamercado_c: item.task_idamercado_c,
            // amercado: '',
            region_c: item.task_region_c,
            // region: item.task_region,
            tipo_tarea_c: item.task_tipo_tarea_c,
            // tipotarea: item.task_tipotarea,
            estado_c: item.task_estado_c,
            // estadotarea: item.task_estadotarea,
            obligatorio_c: item.task_obligatorio_c,
            tarea_para_c: item.task_tarea_para_c,
            // tarea_para: item.task_tarea_para,
            fecha_inicio_regla: item.task_fecha_inicio_regla,
            fecha_fin_regla: item.task_fecha_fin_regla,
          });
        }
        return acc;
      }, {});

      return Object.values(groupedData);
    } catch (error) {
      console.log('Error in getItemRuta:', error);
      throw error;
    }
  }

  async getItemRutaVisita(
    assigned_user_id: string,
    customerid_c: string,
    idContacto: string,
    idCiclo: string,
  ) {
    try {
      const query1 = querySQL.items.Get_ItemRutaVisita(
        assigned_user_id,
        customerid_c,
        idContacto,
        idCiclo,
      );
      const query2 = querySQL.items.Get_ItemRutaPlanificador(
        assigned_user_id,
        customerid_c,
        idContacto,
        idCiclo,
      );

      const [data1, data2] = await Promise.all([
        this.mssqlEntityManager.query(query1),
        this.mssqlEntityManager.query(query2),
      ]);

      const combinedData = [
        ...data1.map((item) => ({ ...item, tipoRegistro: 'VISITA' })),
        ...data2.map((item) => ({ ...item, tipoRegistro: 'PLANIFICADOR' })),
      ];

      combinedData.sort(
        (a, b) => new Date(a.fechaVisita).getTime() - new Date(b.fechaVisita).getTime(),
      );

      return combinedData.length > 0 ? combinedData : [];
    } catch (error) {
      console.log('Error in getItemRutaVisita:', error);
      throw error;
    }
  }

  getMarkers(id: string) {
    try {
      const query = querySQL.items.Get_Markers(id);
      return this.mssqlEntityManager.query<{ id: string; name: string; lat: string; lng: string}[]>(query);
    } catch (error) {
      console.log('Error in getMarkers:', error);
      throw new HttpException('Error fetching markers', 500);
    }
  }

  async getCustomerVisits({
    accountId,
    userId,
    cicloId,
    contactId,
  }: {
    accountId: string;
    contactId: string;
    userId: string;
    cicloId: string;
  }) {
    try {
      const query = querySQL.items.Get_CustomerPlanVisits;
      const queryReal = querySQL.items.Get_CustomerRealVisits;
      const dataPlan = await this.mssqlEntityManager.query(query, [
        contactId,
        accountId,
        userId,
        cicloId,
      ]);

      const dataReal = await this.mssqlEntityManager.query(queryReal, [
        contactId,
        accountId,
        userId,
        cicloId,
      ]);

      return [
        ...dataPlan.map((item) => ({ ...item, exists: false })),
        ...dataReal.map((item) => ({ ...item, exists: true })),
      ].sort((a, b) => moment(b.fecha_inicio_c).diff(moment(a.fecha_inicio_c)));
    } catch (error) {
      console.log('Error in getCustomerVisits:', error);
      throw new HttpException('Error fetching customer visits', 500);
    }
  }

  async getRoutesByGroupId(groupId: string): Promise<RoutePlanningDto[]> {
    if (!groupId || groupId.length < 36) 
      throw new ClientException('Error: Id del grupo no es válido');

    const data = await this.routeRepo.getRoutesByGroupId(groupId);
    return mapDataRelationsForEachRoute(data);
  }

  async getRouteDeliveries(routeId: string): Promise<EntregaPlanningDto[]> {
    if (!routeId || routeId.length < 36)
      throw new ClientException('Error: Id de la ruta no es válido');

    const data = await this.routeRepo.getDeliveriesByRouteId(routeId);
    return mapEntregasProdResultToEntregasPlanning(data); 
  }

  async getVisitDetailsByRouteId(routeId: string)  { 
    const data = await this.routeRepo.getVisitDetailsByRouteId(routeId);

    return mapVisitDetailsByRouteId(data);
  }
}
