import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, InsertResult } from 'typeorm';
import { HanrtItemGroupEntity } from '../entities';
import { HanrtItemGroupRelationsRepository } from './itemgroup-relations.repository';
import { GroupDBResult, GroupResultToCreate } from '../interface';
import { ConfigService } from '@nestjs/config';
import { HanrtItemRutaRelationsRepository } from 'src/hanrt_itemruta/repository/itemruta-relations.repository';
import { Logger } from '@nestjs/common';
type CreateQueryParams = {
  group: HanrtItemGroupEntity;
  vehicleId?: string;
  planningId: string;
  manager?: EntityManager;
};
export class HanrtItemGroupRepository {
  private DB_NAME = '';
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly groupRelationRepo: HanrtItemGroupRelationsRepository,
    private readonly routeRelationRepo: HanrtItemRutaRelationsRepository,
  ) {
    this.DB_NAME = this.configService.get('SQL_DATABASE');
  }

  async getPlanningGroups(
    planId: string,
    blocked?: '00' | '01',
    vehicleId?: string,
  ): Promise<GroupDBResult[]> {
    const blockedGroups =
      blocked !== undefined ? `, @blocked = '${blocked}';` : ';';
    if (vehicleId) {
      return this.entityManager.query<GroupDBResult[]>(
        `EXEC [${this.DB_NAME}].[map].[planning_groups] @planId = '${planId}', @vehicleId = '${vehicleId}' ${blockedGroups}`,
      );
    }
    return this.entityManager.query<GroupDBResult[]>(
      `EXEC [${this.DB_NAME}].[map].[planning_groups] @planId = '${planId}' ${blockedGroups}`,
    );
  }

  async create({
    group,
    planningId,
    vehicleId,
    manager,
  }: CreateQueryParams): Promise<boolean> {
    try {
      let res: InsertResult;
      if (manager && manager instanceof EntityManager) {
        res = await manager.insert(HanrtItemGroupEntity, group);
        if (res.identifiers) {
          await this.groupRelationRepo.addRelationGroupWithPlan(
            group,
            planningId,
            manager,
          );
          await this.groupRelationRepo.addRelationGroupWithVehicle(
            group,
            vehicleId,
            manager,
          );
        }
      } else
        res = await this.createWithoutManager({ group, planningId, vehicleId });

      if (res.identifiers) return true;

      return false;
    } catch (error) {
      throw error;
    }
  }

  async createWithoutManager(data: CreateQueryParams): Promise<InsertResult> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const insertResult = await queryRunner.manager.insert(
        HanrtItemGroupEntity,
        data.group,
      );
      await this.groupRelationRepo.addRelationGroupWithPlan(
        data.group,
        data.planningId,
        queryRunner.manager,
      );
      await this.groupRelationRepo.addRelationGroupWithVehicle(
        data.group,
        data.vehicleId,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return insertResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteGroups(data: {
    groupIds?: string[];
    manager: EntityManager;
    soft?: boolean;
  }) {
    const { groupIds, soft = true, manager } = data;
    if (!groupIds) return;

    const idsRoutesToDelete: string[] = [];
    for (const groupId of groupIds) {
      let idsRoutes: string[] = [];
      if (soft) {
        await manager.update(
          HanrtItemGroupEntity,
          { id: groupId },
          { deleted: 1, date_modified: new Date() },
        );
        await this.groupRelationRepo.removeRelationGroupWithPlans({
          groupId,
          soft,
          manager,
        });
        await this.groupRelationRepo.removeRelationGroupWithVehicles({
          groupId,
          soft,
          manager,
        });
        idsRoutes = await this.groupRelationRepo.removeRelationWithRoutes({
          groupId,
          soft,
          manager,
        });
      } else {
        await manager.delete(HanrtItemGroupEntity, { id: groupId });
        await this.groupRelationRepo.removeRelationGroupWithPlans({
          groupId,
          manager,
          soft,
        });
        await this.groupRelationRepo.removeRelationGroupWithVehicles({
          groupId,
          soft,
          manager,
        });
        idsRoutes = await this.groupRelationRepo.removeRelationWithRoutes({
          groupId,
          manager,
          soft,
        });
      }
      idsRoutesToDelete.push(...idsRoutes);
    }
    Logger.log(
      `Eliminando ${idsRoutesToDelete.length} rutas de todos los grupos`,
      'DELETE GROUPS',
    );
    for (const routeId of idsRoutesToDelete) {
      await this.routeRelationRepo.removeRelationRouteWithAllDeliveries({
        routeId,
        manager,
        soft,
      });
      await this.routeRelationRepo.removeRelationRouteWithAllTasks({
        routeId,
        manager,
        soft,
      });
    }
  }

  async saveGroup(data: {
    group: Partial<HanrtItemGroupEntity> & { id: string };
    vehicleId: string;
    planningId: string;
    manager: EntityManager;
  }): Promise<string> {
    const { group, vehicleId, planningId, manager } = data;
    const exist = await manager.findOneBy(HanrtItemGroupEntity, {
      id: group.id,
    });
    if (exist) {
      const { id, ...someData } = group;
      await manager.update(HanrtItemGroupEntity, { id }, { ...someData });
      return id;
    } else {
      // cambiar ID de grupo
      const id = crypto.randomUUID();
      const newGroup = group as HanrtItemGroupEntity;
      newGroup.id = id;
      newGroup.date_entered = new Date();
      newGroup.created_by = group.modified_user_id;
      newGroup.assigned_user_id = group.modified_user_id;
      Logger.debug(newGroup, 'NEW GROUP');
      await this.create({ group: newGroup, planningId, vehicleId, manager });
      return id;
    }
  }

  async getGroupsToCreate(planId: string): Promise<GroupResultToCreate[]> {
    const query = `SELECT 
        hi.*,
        hihvc.hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida as vehicleId
      FROM hanrt_planificador_hanrt_itemgroup_c hphic
      INNER JOIN hanrt_itemgroup hi 
      ON hi.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb
      AND hi.deleted = 0
      AND hphic.deleted = 0
      AND hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida = '${planId}'
      LEFT JOIN hanrt_itemgroup_hans_vehiculos_c hihvc 
      ON hi.id = hihvc.hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb 
      AND hihvc.deleted = 0`;

    const groups = await this.entityManager.query<GroupResultToCreate[]>(query);
    return groups;
  }
}
