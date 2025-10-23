import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { IHanrtPlanificadorUpdate } from '../interface';
import { v4 as uuidv4 } from 'uuid';

import {
  HanrtPlanificadorEntity,
  HanrtPlanificadorHanrtItemgroupEntity,
  HanrtPlanificadorHansVehiculosEntity,
} from '../entities';
import { date_formater } from 'src/helpers';

@Injectable()
export class HanrtPlanificadorPatchService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

  async getPlanForAuditState(
    id: string,
  ): Promise<{ name: string; } | undefined> {
    const query = `SELECT 
                    name
                  FROM hanrt_planificador hp
                  WHERE hp.id = @0`;

    const result = await this.mssqlEntityManager.query(query, [id]);
    if (result.length > 0) {
      return result[0];
    }
  }

  async getStateById(state: string){
    const query = `SELECT Value FROM pro.hansacrm_list hl WHERE hl.ListId = 'estado_planificacion_c_list' AND hl.Id =  @0`;
    const result = await this.mssqlEntityManager.query(query, [state]);

    if (result.length > 0) {
      return result[0].Value;
    }
  }

  async updateStatus(
    idPlanificador: string,
    nuevoEstado: string,
    idUsuario: string,
  ): Promise<{ success: boolean; message: string; affected?: number }> {
    try {
      const dateModified = new Date();
      dateModified.setHours(dateModified.getHours() - 4);

      const result = await this.mssqlEntityManager.update(
        HanrtPlanificadorEntity,
        { id: idPlanificador} as FindOptionsWhere<HanrtPlanificadorEntity>,
        {
          estado_planificacion_c: nuevoEstado,
          modified_user_id: idUsuario,
          date_modified: dateModified,
        },
      );

      if (result.affected === 0)
        return { success: false, message: 'No rows were updated', affected: 0 };

      if (nuevoEstado === 'EP03' || nuevoEstado === 'EP05') {
        try {
          await this.mssqlEntityManager.query(
            `UPDATE he
             SET he.estado_c = '03'
             FROM hane_entregas he
             JOIN hanrt_itemruta_hane_entregas_c hir ON hir.hanrt_itemruta_hane_entregashane_entregas_idb = he.id
             JOIN hanrt_itemruta hi ON hi.id = hir.hanrt_itemruta_hane_entregashanrt_itemruta_ida
             JOIN hanrt_itemgroup_hanrt_itemruta_c higr ON higr.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb = hi.id
             JOIN hanrt_itemgroup hig ON hig.id = higr.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida
             JOIN hanrt_planificador_hanrt_itemgroup_c hphig ON hphig.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb = hig.id
             JOIN hanrt_planificador hp ON hp.id = hphig.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida
             WHERE hp.id = @0 AND he.estado_c = '07'`,
            [idPlanificador],
          );
        } catch (error) {
          console.log('Error updating hane_entregas:', error);
          return { success: false, message: 'Error updating hane_entregas' };
        }
      }

      return {
        success: true,
        message: 'Update executed successfully',
        affected: result.affected,
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error in updateStatus', affected: 0 };
    }
  }

  async updatePlanificador(hanrtPlanificador: IHanrtPlanificadorUpdate) {
    try {
      const planificador = await this.mssqlEntityManager.findOneBy(
        HanrtPlanificadorEntity,
        {
          id: hanrtPlanificador.id,
          deleted: 0,
        },
      );

      if (!planificador) return 'planificador no encontrado';

      hanrtPlanificador.date_modified = date_formater();
      const updatedPlanificador = { ...planificador, ...hanrtPlanificador };

      return await this.mssqlEntityManager.save(
        HanrtPlanificadorEntity,
        updatedPlanificador,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async updatePlanificadorCiclo(
    idPlanificador: string,
    idCiclo: string,
  ): Promise<{ success: boolean; message: string; affected?: number }> {
    try {
      const date_modified = new Date();

      // Buscar si existe alguna relación con ese idPlanificador
      const existingPlans = await this.mssqlEntityManager.query(
        `SELECT * FROM hanrt_ciclos_hanrt_planificador_c 
         WHERE hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb = @0
         AND deleted = 0`,
        [idPlanificador],
      );

      if (existingPlans.length > 0) {
        const existingPlan = existingPlans[0];

        if (
          existingPlan.hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida ===
          idCiclo
        ) {
          // Ya existe la relación exacta, no hacer nada
          return {
            success: true,
            message: 'La relación ya existe, no se realizaron cambios.',
            affected: 0,
          };
        } else {
          // Existe planificador pero con diferente ciclo, actualizar el ciclo
          const updateQuery = `
            UPDATE hanrt_ciclos_hanrt_planificador_c
            SET hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida = @0, date_modified = @1
            WHERE id = @2
          `;
          const updateValues = [idCiclo, date_modified, existingPlan.id];

          const updateResult = await this.mssqlEntityManager.query(
            updateQuery,
            updateValues,
          );
          const affectedRowsUpdate = updateResult?.rowsAffected?.[0] || 0;

          return {
            success: true,
            message: 'Ciclo actualizado correctamente.',
            affected: affectedRowsUpdate,
          };
        }
      } else {
        // No existe ninguna relación, hacer un insert
        const insertQuery = `
          INSERT INTO hanrt_ciclos_hanrt_planificador_c (
            id,
            date_modified,
            deleted,
            hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida,
            hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb
          ) VALUES (@0, @1, @2, @3, @4)
        `;
        const insertId = uuidv4();
        const insertValues = [
          insertId,
          date_modified,
          0,
          idCiclo,
          idPlanificador,
        ];

        const result = await this.mssqlEntityManager.query(
          insertQuery,
          insertValues,
        );
        const affectedRows = result?.rowsAffected?.[0] || 0;

        return {
          success: true,
          message: 'Plan creado correctamente.',
          affected: affectedRows,
        };
      }
    } catch (error) {
      console.error(
        'Error al actualizar/crear plan:',
        error.message,
        error.stack,
      );
      return {
        success: false,
        message: `Error al actualizar/crear el plan: ${error.message}`,
      };
    }
  }

  async deletePlanificadorVehiculos(
    idPlanificador: string,
    idVehiculo: string,
  ) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtPlanificadorHansVehiculosEntity,
        {
          hanrt_planificador_hans_vehiculoshanrt_planificador_ida:
            idPlanificador,
          hanrt_planificador_hans_vehiculoshans_vehiculos_idb: idVehiculo,
          deleted: 0,
        },
        { deleted: 1, date_modified },
      );

      if (result.affected === 0)
        return { success: false, message: 'Registro no borrado', affected: 0 };

      return {
        success: true,
        message: 'Registro Borrado',
        affected: result.affected,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deletePlanificadorItemgroup(
    idPlanificador: string,
    idItemgroup: string,
  ) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtPlanificadorHanrtItemgroupEntity,
        {
          hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida:
            idPlanificador,
          hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb: idItemgroup,
          deleted: 0,
        },
        { deleted: 1, date_modified },
      );

      if (result.affected === 0)
        return { success: false, message: 'Registro no borrado', affected: 0 };

      return {
        success: true,
        message: 'Registro Borrado',
        affected: result.affected,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
