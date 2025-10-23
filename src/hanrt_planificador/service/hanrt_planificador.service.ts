import { Injectable, Logger } from "@nestjs/common";
import { CreatePlanningQueryDto } from "../dto/create-planning.dto";
import { PlanningCreateToEntity } from "../mappers/planningCreateToEntity.mapper";
import { EntityManager } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm";
import { HanrtPlanificadorRepository } from "../repository/planificador.repository";
import { HanrtItemGroupRepository } from "src/hanrt_itemgroup/repository/hanrt_itemgroup.repository";
import { CreateGroupQueryToEntity, DBResultToCreateDto } from "src/hanrt_itemgroup/mappers/createGroupQuery.mapper";
import { CreateRoutesQueryToEntities, DbQueryToCreateRoute } from "src/hanrt_itemruta/mappers/createRouteQuery.mapper";
import { HanrtItemRutaRepository } from "src/hanrt_itemruta/repository/itemruta.repository";
import { ClonePlanDto, UpdatePlanningQueryDto } from "../dto";
import { PlanningUpdateQueryToEntity } from "../mappers/planningUpdateToEntity.mapper";
import { HanrtPlanificadorRelationsRepository } from "../repository/planificador-relations.repository";
import { GroupUpdateQueryToEntity } from "src/hanrt_itemgroup/mappers/updateGroupQuery.mapper";
import { UpdateRoutesQueryToEntities } from "src/hanrt_itemruta/mappers/updateRouteQuery.mapper";
import { HanrtItemRutaRelationsRepository } from "src/hanrt_itemruta/repository/itemruta-relations.repository";
import { DBResponseToPlanningCreateDto } from "../mappers/planningHeader.mapper";
import { CreateGroupQueryDto } from "src/hanrt_itemgroup/dto";
import { ClientException } from "../helpers/client-exceptions.helper";

@Injectable()
export class HanrtPlanificadorService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly entityManager: EntityManager,
    private readonly planificadorRepo: HanrtPlanificadorRepository,
    private readonly planRelationsRepo: HanrtPlanificadorRelationsRepository,
    private readonly groupRepo: HanrtItemGroupRepository,
    private readonly routeRepo: HanrtItemRutaRepository,
    private readonly rutaRelationsRepo: HanrtItemRutaRelationsRepository,
  ) { }

  async createNewPlanning(plann: CreatePlanningQueryDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    const response = { success: false, planId: '', summary: {} };
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const planificacion = PlanningCreateToEntity(plann.headerPlan);
      const groups = plann.groups ?? [];
      await this.planificadorRepo.createPlan(planificacion, queryRunner.manager);
      await this.planRelationsRepo.relationPlanWithVehicles(planificacion.id, plann.vehiclesIds ?? [], queryRunner.manager);
      await this.planRelationsRepo.relationPlanWithCycle({planId: planificacion.id, cycleId: plann.headerPlan.cycleId, manager: queryRunner.manager });
      const resGroups: Record<string, number> = {};
      for (const group of groups) {
        const groupMapped = CreateGroupQueryToEntity(group);
        resGroups[groupMapped.id] = 0;
        const res = await this.groupRepo.create({ group: groupMapped, vehicleId: group.idVehiculo, planningId: planificacion.id, manager: queryRunner.manager })
        if (res) {
          const routes = CreateRoutesQueryToEntities(group.rutas ?? []);
          const visitsRes = await this.routeRepo.create({ routes: routes, groupId: groupMapped.id, manager: queryRunner.manager }) 
          resGroups[groupMapped.id] = visitsRes;
        }
      }
      await queryRunner.commitTransaction();
      response.success = true;
      response.planId = planificacion.id;
      response.summary = resGroups;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return response;
  }

  async updatePlanning(plann: UpdatePlanningQueryDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    const response = { success: false, planId: plann.headerPlan.id, summary: {} };
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const planning = PlanningUpdateQueryToEntity(plann.headerPlan);
      const planId = planning.id;
      const modifiedGroups = plann.groupActions ?? [];
      await this.planificadorRepo.updatePlann(planning, queryRunner.manager);
      await this.planificadorRepo.updateCyclePlan({ planId: planId, cycleId: plann.headerPlan.cycleId, manager: queryRunner.manager });
      await this.groupRepo.deleteGroups({ groupIds: plann?.deletes?.groups ?? [], manager: queryRunner.manager });
      await this.routeRepo.deleteRoutes({ routeIds: plann?.deletes?.routes ?? [], manager: queryRunner.manager });
      await this.rutaRelationsRepo.removeRelationRouteWithTasks(plann?.deletes?.tasks ?? {}, queryRunner.manager);
      await this.rutaRelationsRepo.removeRelationRouteWithDeliveries(plann?.deletes?.deliveries ?? {}, queryRunner.manager);
      await this.planRelationsRepo.removeRelationWithVehicles({vehicleIds: plann?.vehicles?.delete ?? [], planId, manager: queryRunner.manager});
      await this.planRelationsRepo.relationPlanWithVehicles(plann.headerPlan.id, plann?.vehicles?.add ?? [], queryRunner.manager);
      const resGroups: Record<string, { updates: number, inserts: number }> = {};

      for (const group of modifiedGroups) {
        const groupMapped = GroupUpdateQueryToEntity(group);
        resGroups[groupMapped.id] = { updates: 0, inserts: 0 };
        const resId = await this.groupRepo.saveGroup({ group: groupMapped, vehicleId: group.idVehiculo, planningId: planId, manager: queryRunner.manager })
        if (resId) {
          const routes = UpdateRoutesQueryToEntities(group.rutas ?? []);
          const visitsRes = await this.routeRepo.saveRoutes({ routes: routes, groupId: resId, manager: queryRunner.manager }) 
          resGroups[groupMapped.id] = visitsRes;
        }
      }
      await queryRunner.commitTransaction();
      response.success = true;
      response.planId = plann.headerPlan.id;
      response.summary = resGroups;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return response;
  }

  async clonePlanning(data: ClonePlanDto) {
    const { name, planId } = data;
    const header = await this.planificadorRepo.getHeader(planId);
    if (!header) throw new ClientException('No se encontró la planificación a clonar');

    const headerToPlan = DBResponseToPlanningCreateDto(header, name);
    const vehicleIdsList = await this.planRelationsRepo.getVehicleIdsToPlan(planId);
    const groups = await this.groupRepo.getGroupsToCreate(planId);
    const groupsToCreate: CreateGroupQueryDto[] = [];
    for (const group of groups) {
      const routesRaw = await this.routeRepo.getRoutesToCreate(group.id);
      const routes = routesRaw.map(DbQueryToCreateRoute);
      const groupToCreate: CreateGroupQueryDto = DBResultToCreateDto(group);
      groupToCreate.rutas = routes;
      groupsToCreate.push(groupToCreate);
    }
    // Logger.debug({ headerPlan: headerToPlan, vehiclesIds: vehicleIdsList, groups: groupsToCreate })
    const response = await this.createNewPlanning({ headerPlan: headerToPlan, vehiclesIds: vehicleIdsList, groups: groupsToCreate });
    return response;
  }
}