import { InjectEntityManager } from '@nestjs/typeorm';
import { DataSource, EntityManager, InsertResult, UpdateResult } from 'typeorm';
import { HanrtItemrutaEntity } from '../entities';
import { HanrtItemRutaRelationsRepository } from './itemruta-relations.repository';
import { RouteToCreate, RouteToUpdate, VisitUpdateOrder } from '../types';
import * as sql from 'mssql';
import { ConfigService } from '@nestjs/config';
import { ContactRawPlanning } from 'src/contacts/interface';
import { ItemRutaRaw, ItemRutaRawToCreate } from '../interfaces';
import { AccountRawPlanning } from 'src/accounts/interface';
import { TareaRawPlanning } from 'src/hanrt_tareasplan/types';
import { IEntregaProductPlanningResult } from 'src/hane_entregas/interface';
import { Logger } from '@nestjs/common';
import { detailQuery } from '../SQL';

type CreateRoutesQuery = {
  routes: RouteToCreate[];
  groupId: string;
  manager?: EntityManager;
};
type UpdateRoutesQuery = {
  routes: RouteToUpdate[];
  groupId: string;
  manager: EntityManager;
};
type CreateRouteQuery = {
  route: RouteToCreate;
  groupId: string;
  manager?: EntityManager;
};
export class HanrtItemRutaRepository {
  private DB_NAME = '';
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly entityManager: EntityManager,
    private readonly rutaRelationsRepo: HanrtItemRutaRelationsRepository,
    private readonly configService: ConfigService,
  ) {
    this.DB_NAME = this.configService.get('SQL_DATABASE');
  }

  async create({
    routes,
    groupId,
    manager,
  }: CreateRoutesQuery): Promise<number> {
    try {
      let inserteds = 0;
      for (const route of routes) {
        let res: InsertResult;
        if (manager && manager instanceof EntityManager)
          res = await this.createWithManager({
            route: route,
            groupId,
            manager,
          });
        else res = await this.createWithoutManager({ route: route, groupId });

        if (res.identifiers) inserteds += 1;
      }
      return inserteds;
    } catch (error) {
      throw error;
    }
  }

  async saveRoutes({
    routes,
    groupId,
    manager,
  }: UpdateRoutesQuery): Promise<{ updates: number; inserts: number }> {
    try {
      let inserts = 0;
      let updates = 0;
      for (const route of routes) {
        let res: InsertResult = {
          identifiers: undefined,
          generatedMaps: undefined,
          raw: undefined,
        };
        let resUpdate: UpdateResult = {
          generatedMaps: undefined,
          raw: undefined,
          affected: 0,
        };
        const exist = await manager.existsBy(HanrtItemrutaEntity, {
          id: route.route.id,
        });
        if (exist) {
          resUpdate = await manager.update(
            HanrtItemrutaEntity,
            { id: route.route.id },
            { ...route.route },
          );
          Logger.log(`Route ID ${route.route.id} updated`, 'SAVE ROUTES');
          await this.rutaRelationsRepo.relationRouteWithGroup(
            route.route.id,
            groupId,
            manager,
          );
          await this.rutaRelationsRepo.relationRouteWithTasks(
            route.route.id,
            route.routeTasks,
            manager,
          );
          await this.rutaRelationsRepo.relationRouteWithDeliveries(
            route.route.id,
            route.routeDeliveries,
            manager,
          );
          await this.rutaRelationsRepo.relationRouteWithAccount(
            route.route.id,
            route.accountId,
            manager,
          );
          await this.rutaRelationsRepo.relationRouteWithContact(
            route.route.id,
            route.contactId,
            manager,
          );
        } else {
          const routeToCreate: HanrtItemrutaEntity = {
            ...(route.route as HanrtItemrutaEntity),
            id: crypto.randomUUID(),
            date_entered: new Date(),
            assigned_user_id: route.route.modified_user_id,
            created_by: route.route.modified_user_id,
          };
          const toCreate: CreateRouteQuery = {
            route: {
              route: routeToCreate,
              accountId: route.accountId,
              contactId: route.contactId,
              routeDeliveries: route.routeDeliveries,
              routeTasks: route.routeTasks,
            },
            groupId,
            manager,
          };
          res = await this.createWithManager(toCreate);
        }

        if (res.identifiers) inserts += 1;
        if (resUpdate.affected) updates += 1;
      }
      return { inserts, updates };
    } catch (error) {
      throw error;
    }
  }

  async createWithManager({
    route,
    groupId,
    manager,
  }: CreateRouteQuery): Promise<InsertResult> {
    Logger.log(`Insertando Ruta ID ${route.route.id}`, 'CREATE WITH MANAGER');
    const insertRes = await manager.insert(HanrtItemrutaEntity, {
      ...route.route,
    });
    if (insertRes.identifiers) {
      await this.rutaRelationsRepo.relationRouteWithGroup(
        route.route.id,
        groupId,
        manager,
      );
      await this.rutaRelationsRepo.relationRouteWithTasks(
        route.route.id,
        route.routeTasks,
        manager,
      );
      await this.rutaRelationsRepo.relationRouteWithDeliveries(
        route.route.id,
        route.routeDeliveries,
        manager,
      );
      await this.rutaRelationsRepo.relationRouteWithAccount(
        route.route.id,
        route.accountId,
        manager,
      );
      await this.rutaRelationsRepo.relationRouteWithContact(
        route.route.id,
        route.contactId,
        manager,
      );
    }
    return insertRes;
  }

  async createWithoutManager({
    route,
    groupId,
  }: CreateRouteQuery): Promise<InsertResult> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const insertResult = await queryRunner.manager.insert(
        HanrtItemrutaEntity,
        { ...route.route },
      );
      await this.rutaRelationsRepo.relationRouteWithGroup(
        route.route.id,
        groupId,
        queryRunner.manager,
      );
      await this.rutaRelationsRepo.relationRouteWithTasks(
        route.route.id,
        route.routeTasks,
        queryRunner.manager,
      );
      await this.rutaRelationsRepo.relationRouteWithDeliveries(
        route.route.id,
        route.routeDeliveries,
        queryRunner.manager,
      );
      await this.rutaRelationsRepo.relationRouteWithAccount(
        route.route.id,
        route.accountId,
        queryRunner.manager,
      );
      if (route.contactId)
        await this.rutaRelationsRepo.relationRouteWithContact(
          route.route.id,
          route.contactId,
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

  async deleteRoutes(data: {
    routeIds?: string[];
    soft?: boolean;
    manager: EntityManager;
  }) {
    const { routeIds, soft = true, manager } = data;
    if (!routeIds) return;

    for (const routeId of routeIds) {
      if (soft) {
        await manager.update(
          HanrtItemrutaEntity,
          { id: routeId },
          { deleted: 1, date_modified: new Date() },
        );
      } else await manager.delete(HanrtItemrutaEntity, { id: routeId });

      await this.rutaRelationsRepo.removeRelationRouteWithGroup({
        routeId,
        soft,
        manager,
      });
      await this.rutaRelationsRepo.removeRelationRouteWithAllTasks({
        manager,
        routeId,
        soft,
      });
      await this.rutaRelationsRepo.removeRelationRouteWithAllDeliveries({
        manager,
        routeId,
        soft,
      });
    }
  }

  async getRoutesByGroupId(groupId: string): Promise<{
    routes: ItemRutaRaw[];
    tasks: TareaRawPlanning[];
    contacts: ContactRawPlanning[];
    accounts: AccountRawPlanning[];
  }> {
    try {
      const connection: DataSource = this.entityManager.connection;
      const driver = connection.driver as any; // TODO: mssql
      const pool = driver.master;
      const request = pool.request();
      request.input('groupId', sql.NVarChar(36), groupId);

      // ItemRutaRaw[], tareas[], contacto[], cuentas[]
      const result = await request.execute(
        `${this.DB_NAME}.[map].[planning_group_routes]`,
      );
      const res = result.recordsets as [
        ItemRutaRaw[],
        TareaRawPlanning[],
        ContactRawPlanning[],
        AccountRawPlanning[],
      ];

      return {
        routes: res[0],
        tasks: res[1],
        contacts: res[2],
        accounts: res[3],
      };
    } catch (error) {
      throw error;
    }
  }

  async getDeliveriesByRouteId(
    routeId: string,
  ): Promise<IEntregaProductPlanningResult[]> {
    const data = await this.entityManager.query<
      IEntregaProductPlanningResult[]
    >(
      `EXEC [${this.DB_NAME}].[map].[get_deliveries_by_route_id] @routeId = '${routeId}';`,
    );
    return data;
  }

  async getRoutesToCreate(groupId: string): Promise<ItemRutaRawToCreate[]> {
    const result = await this.entityManager.query<ItemRutaRawToCreate[]>(
      `EXEC [${this.DB_NAME}].[map].[planning_routes_to_create] @groupId = '${groupId}';`,
    );
    return result;
  }

  async getVisitDetailsByRouteId(routeId: string) {
    try {
      const tasksModuleDictionary = {
        ENTPROD: 'HANE_Entregas',
        Entrega: 'HANE_Entregas',
        Distribucion: 'HANE_Entregas',
      };

      const [data] = await this.entityManager.query(detailQuery.detail, [
        routeId,
      ]);

      const tasks = [];
      
      if (!data.visitaId) {
        const taskPlan = await this.entityManager.query(
          detailQuery.planTask,
          [routeId],
        );
        Logger.debug({routeId});

        if (taskPlan.length) tasks.push(...taskPlan);
      }

      const tasksForExecution = await this.entityManager.query(detailQuery.tasks, [
        routeId,
      ]);

      for (const task of tasksForExecution) {
        const type = task.type.split('_').at(-1);

        if (!type) continue;
        const module = tasksModuleDictionary[type];

        if (!module) continue;
        const [countResult] = await this.entityManager.query(
          detailQuery.module(module),
          [module, task.id],
        );

        task.module = {
          type: module,
          value: countResult ? countResult.count : 0,
        };
      }

      tasks.push(...tasksForExecution);

      return {
        ...data,
        tasks,
      };
    } catch (error) {
      throw error;
    }
  }

  async reorderRoutes(orderedRoute: VisitUpdateOrder[]) {
    const result = await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        for (const route of orderedRoute) {
          const { id, duracion, horaFin, horaInicio, secuencia, userId } =
            route;
          await transactionalEntityManager.update(
            'hanrt_itemruta',
            { id },
            {
              secuencia_c: secuencia,
              duracion_c: new Date(duracion),
              hora_fin_c: new Date(horaFin),
              hora_inicio_c: new Date(horaInicio),
              modified_user_id: userId,
              date_modified: new Date(),
            },
          );
        }
      },
    );

    return result;
  }
}
