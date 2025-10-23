import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  agruparGroup,
  agruparPlanificacion,
} from '../helpers';
import * as querySQL from '../SQL';
import { Group_Ruta_Regla_Actividad } from '../interface';
import { HanrtPlanificadorRepository } from '../repository/planificador.repository';
import { PlanificadorHeaderDto, PlanificadorLogisticsDto } from '../dto';
import { DBResponseToPlanningHeader } from '../mappers/planningHeader.mapper';
import { ClientException } from '../helpers/client-exceptions.helper';
import { mapVehiculosRawToDto } from 'src/hans_vehiculos/mappers/planning-vehicles.mapper';
@Injectable()
export class HanrtPlanificadorGetService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly planningRepo: HanrtPlanificadorRepository,
  ) {}

  async getRutasByPlanificadorId(planificadorId: string) {
    try {
      const rutas = await this.mssqlEntityManager.query(
        `
        SELECT
          hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida AS groupId,
          count(hit.id) AS rutaCount
        INTO #rutas
        FROM hanrt_itemruta hit
        JOIN hanrt_itemgroup_hanrt_itemruta_c hihic ON hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb = hit.id AND hihic.deleted = 0
        WHERE hit.deleted = 0
        GROUP BY hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida

        CREATE NONCLUSTERED INDEX IX_temp_rutas
        ON #rutas(groupId);

        SELECT 
            hi.id,
            hi.name,
            hi.description,
            hi.assigned_user_id,
            hi.fecha_plan_c,
            hi.capacidad_c,
            hi.hora_inicio_c,
            hi.duracion_c,
            hi.hora_fin_c,
            hi.secuencia_c,
            hi.bloqueado_c,
            hi2.rutaCount as total_clientes,
          u.id AS userId,
          u.user_name AS user_name,
          CONCAT(
            (CASE
              WHEN u.first_name IS NULL THEN ''
              ELSE CONCAT(u.first_name, ' ')
            END),
            (CASE
              WHEN u.last_name IS NULL THEN ''
              ELSE u.last_name
            END)
          ) as full_name
        FROM hanrt_itemgroup hi
        JOIN hanrt_planificador_hanrt_itemgroup_c hphic ON hi.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb AND hphic.deleted = 0
        LEFT JOIN #rutas hi2 ON hi2.groupId = hi.id
        LEFT OUTER JOIN users u ON u.id = hi.assigned_user_id AND u.deleted = 0
        WHERE hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida = @0
        AND hi.deleted = 0
        AND hi.bloqueado_c = '00'
        ORDER BY CAST(hi.secuencia_c as INT) ASC

        DROP TABLE #rutas
      `,
        [planificadorId],
      );

      return rutas.map((ruta) => ({
        ...ruta,
        usuario_asignado: {
          id: ruta.userId,
          user_name: ruta.user_name,
          full_name: ruta.full_name,
        },
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getPlanificador(idPlanificador: string) {
    try {
      //** OBTENEMOS EL REGISTRO DE PLANIFICACIÓN */
      const query =
        querySQL.hanrt_planificador.Get_Hanr_Planifidor_By_Id(idPlanificador);
      const data_planificador = await this.mssqlEntityManager.query(query);
      const result_planificador = data_planificador[0];

      //** OBTENEMOS LA LISTA DE USUARIOS ASIGNADOS */
      const query_users =
        querySQL.hanrt_planificador.Get_Users_Hanr_Planificador(idPlanificador);
      const result_users = await this.mssqlEntityManager.query(query_users);

      //** OBTENEMOS LA LISTA DE VEHICULOS ASIGNADOS */
      const query_vehiculos =
        querySQL.hanrt_planificador.Get_Vehiculos_Hanr_Planificador(
          idPlanificador,
        );
      const result_vehiculos = await this.mssqlEntityManager.query(
        query_vehiculos,
      );
      // Agrupar los datos usando el helper
      //const result_vehiculos = agruparVehiculos(data_vehiculos);

      //** OBTENEMOS LA LISTA DE GRUPOS EN LA PLANIFICACIÓN  */
      // const query_groups   = // querySQL.hanrt_planificador.Get_Group_Ruta_Hanr_Planificador(idPlanificador);
      const data_groups: Group_Ruta_Regla_Actividad[] =
        await this.mssqlEntityManager.query(
          `EXEC [dbo].[hsp_PLAN_get_planificacion] '${idPlanificador}'`,
        );
      // Agrupar los Group, Rutas, Reglas y Taraes usando el helper
      const result_groups = agruparGroup(data_groups); //console.log(JSON.stringify(result1, null, 2));

      const queryTareasCabecera =
        querySQL.hanrt_planificador.Get_TareasCabecera_By_Id(idPlanificador);
      const data_tareas = await this.mssqlEntityManager.query(queryTareasCabecera);
      const result_TareasCabecera = data_tareas;


      //** RESULTADO */
      const result = {
        result_planificador,
        result_users,
        result_vehiculos,
        result_groups,
        result_TareasCabecera
      };
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllPlanificador() {
    try {
      const query = querySQL.hanrt_planificador.Get_All_Hanrt_Planificaciones;
      const data_planificadores = await this.mssqlEntityManager.query(query);
      const result_data = agruparPlanificacion(data_planificadores);
      return result_data;
    } catch (error) {
      console.log(error);
    }
  }

  async getVehiculosPlanificador(planId: string) {
    try {
      const query = querySQL.hanrt_planificador.Get_Vehiculos_Hanr_Planificador(
        planId,
      );
      const data_vehiculos = await this.mssqlEntityManager.query(query);
      
      return data_vehiculos.map((vehiculo: any) => {
        return {
          ...vehiculo,
          conductores: JSON.parse(vehiculo.conductores || '[]'),
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getPlanningHeader(planId: string): Promise<PlanificadorHeaderDto> {
    const data = await this.planningRepo.getHeader(planId);
    if (!data) throw new ClientException('Planificador no encontrado', 404);
    return DBResponseToPlanningHeader(data);
  }

  async getPlanningLogistics(planId: string): Promise<any> {
    const data = await this.planningRepo.getPlanningLogistics(planId);
    if(!data.userPlan) throw new ClientException('Planificador no encontrado', 404);
    const vehiclesMapped = mapVehiculosRawToDto(data.vehicles);
    return {
      tasks: data.tasks,
      userPlan: data.userPlan,
      vehicles: vehiclesMapped,
    }
  }
}
