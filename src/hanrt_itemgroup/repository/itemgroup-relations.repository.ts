import { EntityManager } from "typeorm";
import { HanrtItemGroupEntity, HanrtItemgroupHanrtItemrutaEntity, HanrtItemgroupHansVehiculosEntity } from "../entities";
import { Logger } from "@nestjs/common";
import { HanrtPlanificadorHanrtItemgroupEntity } from "src/hanrt_planificador/entities";

export class HanrtItemGroupRelationsRepository {
  constructor() { }

  async addRelationGroupWithVehicle(group: HanrtItemGroupEntity, vehicleId: string, manager: EntityManager) {
    Logger.log(`VehicleId: ${vehicleId}, groupID: ${group.id}`, 'Relation group-vehicle')
    if (!vehicleId) return;
    const exist = await manager.existsBy(HanrtItemgroupHansVehiculosEntity, {
      hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb: group.id,
      hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida: vehicleId,
    })

    if (!exist) {
      await manager.insert(HanrtItemgroupHansVehiculosEntity, {
        date_modified: new Date(),
        deleted: 0,
        hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb: group.id,
        hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida: vehicleId,
        id: crypto.randomUUID(),
      });
    }
  }

  async addRelationGroupWithPlan(group: HanrtItemGroupEntity, planningId: string, manager: EntityManager) {
    const exist = await manager.existsBy(HanrtPlanificadorHanrtItemgroupEntity, { hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb: group.id, hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida: planningId })
    if (!exist) {
      await manager.insert(HanrtPlanificadorHanrtItemgroupEntity, {
        date_modified: new Date(),
        deleted: 0,
        hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb: group.id,
        hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida: planningId,
        id: crypto.randomUUID(),
      });
    }
  }

  async removeRelationGroupWithVehicles(data: { groupId: string, soft?: boolean, manager: EntityManager } ) {
    const { groupId, soft = true, manager } = data;

    if (soft) {
      await manager.update(HanrtItemgroupHansVehiculosEntity, { 
        hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb: groupId
      }, { deleted: 1, date_modified: new Date() });
    } else {
        await manager.delete(HanrtItemgroupHansVehiculosEntity, { hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb: groupId });
    }
  }

  async removeRelationGroupWithPlans(data: { groupId: string, soft?: boolean, manager: EntityManager }) {
    const { groupId, soft = true, manager } = data;

    if (soft){
      await manager.update(HanrtPlanificadorHanrtItemgroupEntity, { 
        hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb: groupId 
      }, { deleted: 1, date_modified: new Date() });
    } else
      await manager.delete(HanrtPlanificadorHanrtItemgroupEntity, { hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb: groupId });
  }

  async removeRelationWithRoutes(data: { groupId: string, soft?: boolean, manager: EntityManager }): Promise<string[]> {
    const { groupId, soft = true, manager } = data;
    const relationRoutes = await manager.findBy(HanrtItemgroupHanrtItemrutaEntity, {
        hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida: groupId })
    const routeIds: string[] = [];
    for (const routeRelation of relationRoutes) {
      if (soft) {
        routeRelation.deleted = 1;
        routeRelation.date_modified = new Date();
        await manager.save(HanrtItemgroupHanrtItemrutaEntity, routeRelation);
      } else {
        await manager.delete(HanrtItemgroupHanrtItemrutaEntity, { hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida: groupId });
      }
      routeIds.push(routeRelation.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb);
    }
    return routeIds;
  }
}