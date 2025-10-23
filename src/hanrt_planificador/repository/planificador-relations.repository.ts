import { Logger } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { HanrtPlanificadorHansVehiculosEntity } from "../entities";
import { HanrtCiclosHanrtPlanificadorC } from "../entities/hanrt_ciclos_hanrt_planificador_c.entity";
import { InjectEntityManager } from "@nestjs/typeorm";

export class HanrtPlanificadorRelationsRepository {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly manager: EntityManager,
  ){}

  async getVehicleIdsToPlan(planId: string): Promise<string[]> {
    const query = `SELECT 
      hphvc.hanrt_planificador_hans_vehiculoshans_vehiculos_idb as vehicleId 
    FROM hanrt_planificador_hans_vehiculos_c hphvc 
    WHERE hphvc.hanrt_planificador_hans_vehiculoshanrt_planificador_ida = '${planId}' 
    AND hphvc.deleted = 0
    `;

    const data = await this.manager.query(query);
    return data.map((item: { vehicleId: string }) => item.vehicleId);
  }

  async relationPlanWithVehicles(planId: string, vehiclesIds: string[], manager: EntityManager) {
    for(const vehicleId of vehiclesIds) {
      await this.relationPlanWithVehicle(planId, vehicleId, manager);
    }
    Logger.log(`Relacionando ${vehiclesIds.length} vehiculos`, 'PLAN VEHICLES')
  }

  async relationPlanWithVehicle(planId: string, vehicleId: string, manager: EntityManager) {
    const exist = await manager.existsBy(HanrtPlanificadorHansVehiculosEntity, {
      hanrt_planificador_hans_vehiculoshanrt_planificador_ida: planId,
      hanrt_planificador_hans_vehiculoshans_vehiculos_idb: vehicleId,
    });
    if (!exist) {
      await manager.insert(HanrtPlanificadorHansVehiculosEntity, {
        id: crypto.randomUUID(),
        date_modified: new Date(),
        deleted: 0,
        hanrt_planificador_hans_vehiculoshanrt_planificador_ida: planId,
        hanrt_planificador_hans_vehiculoshans_vehiculos_idb: vehicleId,
      })
    }
  }

  async relationPlanWithCycle(data: { planId: string, cycleId?: string, manager: EntityManager }) {
    const { planId, cycleId, manager } = data;
    if (!cycleId) return;

    const exist = await manager.existsBy(HanrtCiclosHanrtPlanificadorC, {
      hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida: cycleId,
      hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb: planId,
    });
    
    if (!exist) {
      await manager.insert(HanrtCiclosHanrtPlanificadorC, {
        id: crypto.randomUUID(),
        date_modified: new Date(),
        deleted: 0,
        hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida: cycleId,
        hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb: planId,
      });
    }
  }

  async removeRelationWithVehicle(data: {vehicleId: string, planId: string, soft?: boolean, manager: EntityManager }) {
    const { vehicleId, planId, soft = true, manager } = data;
    if (soft) {
      return manager.update(
        HanrtPlanificadorHansVehiculosEntity,
        {
          hanrt_planificador_hans_vehiculoshanrt_planificador_ida:
            planId,
          hanrt_planificador_hans_vehiculoshans_vehiculos_idb: vehicleId,
          deleted: 0,
        },
        { deleted: 1, date_modified: new Date() },
      );
    } else {
      return manager.delete(HanrtPlanificadorHansVehiculosEntity, {
        hanrt_planificador_hans_vehiculoshanrt_planificador_ida:
          planId,
        hanrt_planificador_hans_vehiculoshans_vehiculos_idb: vehicleId,
      });
    }
  }

  async removeRelationWithVehicles(data: { vehicleIds: string[], planId: string, soft?: boolean, manager: EntityManager }) {
    const { vehicleIds, planId, soft = true, manager } = data;
    for (const vehicleId of vehicleIds) {
      await this.removeRelationWithVehicle({ vehicleId, planId, soft, manager });
    }
  }

  async removeRelationsWithCycle(data: { planId: string, soft?: boolean, manager: EntityManager }) {
    const { planId, soft = true, manager } = data;
    if (soft) {
      return manager.update(
        HanrtCiclosHanrtPlanificadorC,
        {
          hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb: planId,
          deleted: 0,
        },
        { deleted: 1, date_modified: new Date() },
      );
    } else {
      return manager.delete(HanrtCiclosHanrtPlanificadorC, {
        hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb: planId,
      });
    }
  }
}