import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, InsertResult, UpdateResult } from "typeorm";
import { PlanificadorInsertsRepository } from "./planificador-inserts.repository";
import { PlanificadorUpdatesRespository } from "./planificador-updates.repository";
import { PlanificadorDeletionsRepository } from "./planificador-deletions.repository";
import { UpdatePlanningDto } from "../dto";
import { IPlanningHeaderResult, IUpdatePlanningItem, PlanningRouteDataToUpdate, PlanningRouteItemData, typeUpdateItem } from "../interface";
import { IHanrtItemgroupUpdate } from "src/hanrt_itemgroup/interface";
import { HanrtPlanificadorEntity } from "../entities";
import { IHanrtItemrutaUpdate } from "src/hanrt_itemruta/interfaces";
import { Logger } from "@nestjs/common";
import * as querySQL from '../SQL';
import { HanrtPlanificadorRelationsRepository } from "./planificador-relations.repository";
import { TareaLogisticDto } from "src/hanrt_tareasplan/dto";
import { UserPlanningDto } from "src/users/dto";
import { VehiculoRaw } from "src/hans_vehiculos/interface";
export type ResUpdate = {
  inserts: Record<string, number>;
  updates: Record<string, number>;
  deletions: Record<string, number>;
}
export class HanrtPlanificadorRepository {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly insertsRepo: PlanificadorInsertsRepository,
    private readonly updatesRepo: PlanificadorUpdatesRespository,
    private readonly deletionsRepo: PlanificadorDeletionsRepository,
    private readonly planRelationsRepo: HanrtPlanificadorRelationsRepository,
  ) {}

  async getHeader(planId: string): Promise<IPlanningHeaderResult | null> {
    const query = querySQL.hanrt_planificador.Get_Hanr_Planifidor_By_Id_V2(planId);
    const data_planificador = await this.mssqlEntityManager.query<[IPlanningHeaderResult]>(query);
    if(!data_planificador.length)
      return null;  
    return data_planificador[0];
  }

  async getPlanningLogistics(planId: string): Promise<{ tasks: TareaLogisticDto[], vehicles: VehiculoRaw[], userPlan: UserPlanningDto }> {
    const queryHeaderTasks = querySQL.hanrt_planificador.Get_TareasCabecera_By_Id(planId);
    const queryVehicles =  querySQL.hanrt_planificador.Get_Vehiculos_Hanr_Planificador(planId);
    const queryUserPlan = querySQL.hanrt_planificador.Get_Users_Hanr_Planificador(planId);

    const [headerTasks, vehicles, userPlan] = await Promise.all([
      this.mssqlEntityManager.query<TareaLogisticDto[]>(queryHeaderTasks),
      this.mssqlEntityManager.query<VehiculoRaw[]>(queryVehicles),
      this.mssqlEntityManager.query<[UserPlanningDto]>(queryUserPlan),
    ])

    return {
      tasks: headerTasks,
      vehicles: vehicles,
      userPlan: userPlan[0],
    }
  }

  async getPlanHeader(id: string) {
    const query = `
      SELECT * FROM hanrt_planificador hp
      WHERE hp.id = @0 AND hp.deleted = 0
    `;
    const result = await this.mssqlEntityManager.query(query, [id]);
    return result.length > 0 ? result[0] : null;
  }

  async createPlan(plann: HanrtPlanificadorEntity, manager?: EntityManager): Promise<boolean> {
    try {
      let res: InsertResult; 
      if(manager && manager instanceof EntityManager)
        res = await manager.insert(HanrtPlanificadorEntity, plann);
      else
        res = await this.create(plann);

      Logger.log(`Plan creado ${res.identifiers.length}`, 'PLAN CREATE')
      if(res.identifiers.length)
        return true;
      return false;
    } catch (error) {
      throw error;
    }
  }

  create(plann: HanrtPlanificadorEntity): Promise<InsertResult> {
    return this.mssqlEntityManager.insert(HanrtPlanificadorEntity, plann);
  }

  update(plann: Partial<HanrtPlanificadorEntity> & { id: string }){
    const { id, ...someData } = plann;
    return this.mssqlEntityManager.update(HanrtPlanificadorEntity, {
      id
    }, {
      ...someData
    });
  }

  async updatePlann(plann: Partial<HanrtPlanificadorEntity> & { id: string }, manager?: EntityManager): Promise<boolean> {
    let res: UpdateResult; 
    const { id, ...someData } = plann;
    if(manager && manager instanceof EntityManager) {
      res = await manager.update(HanrtPlanificadorEntity, { id: id }, { ...someData });
    } else
      res = await this.update(plann);

    Logger.log(`Plan actualizado ${res.affected} afectados`, 'PLAN UPDATE')
    if(res.affected)
      return true;
    return false;
  }

  async updateCyclePlan(data: { planId: string, cycleId?: string, manager: EntityManager }) {
    const { planId, cycleId, manager } = data;
    if (!cycleId) return;

    await this.planRelationsRepo.removeRelationsWithCycle({ planId, manager });
    await this.planRelationsRepo.relationPlanWithCycle({ planId, cycleId, manager });
  }

  async updatePlanificadorPersist(data: UpdatePlanningDto): Promise<ResUpdate> {
    const queryRunner = this.mssqlEntityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let result: ResUpdate = {
      inserts: {},
      updates: {},
      deletions: {},
    };

    try {
      result.inserts = await this.updatePlanningInserts(queryRunner.manager, data.inserts);
      result.updates = await this.updatePlanningUpdates(queryRunner.manager, data.updates);
      result.deletions = await this.updatePlanningDeletes(queryRunner.manager, data.delets);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePlanningInserts(manager: EntityManager, data: IUpdatePlanningItem[]): Promise<Record<string, number>> {
    const result = {};
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      
      switch (item.type) {
        case typeUpdateItem.planificadorVehiculos:
          await this.insertsRepo.saveRelationPlanificadorVehiculo(manager, item.itemData['idVehiculo'], item.itemData['idPlanificador']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemgroup:
          const routesInserteds = await this.createItemsRoutesForGroup(manager, item);      
          result[item.type] = (result[item.type] || 0) + 1;
          result[typeUpdateItem.itemruta] = (result[typeUpdateItem.itemruta] || 0) + routesInserteds;
          break;

        case typeUpdateItem.itemgroupVehiculos:
          await this.insertsRepo.saveRelationItemGroupVehiculo(manager, item.itemData['idItemgroup'], item.itemData['idVehiculo']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemruta:
          const itemRuta = item.itemData as PlanningRouteItemData;
          await this.insertsRepo.saveItemRutaForItemGroup(manager, itemRuta, itemRuta.idItemgroup ?? '');
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemrutaAccounts:
          await this.insertsRepo.saveRelationItemRouteAccount(manager, item.itemData['idItemruta'], item.itemData['idAccount']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemrutaContact:
          await this.insertsRepo.saveRelationItemRouteContact(manager, item.itemData['idItemruta'], item.itemData['idContact']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;
        
        case typeUpdateItem.itemrutaTareasplan:
          await this.insertsRepo.saveRelationItemRutaTareaPlan(manager, item.itemData['idItemruta'], item.itemData['idTareasplan']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemrutaEntregas:
          await this.insertsRepo.saveRelationItemRutaEntrega(manager, item.itemData['idItemruta'], item.itemData['idEntrega']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        default:
          break;
      }
    }
    return result;
  }

  async updatePlanningUpdates(manager: EntityManager, data: IUpdatePlanningItem[]): Promise<Record<string, number>> {
    const result = {}
    for (let u = 0; u < data.length; u++) {
      const item = data[u];

      switch (item.type) {
        case typeUpdateItem.planificador:
          const plannData = item.itemData as Partial<HanrtPlanificadorEntity>;
          await this.updatesRepo.updatePlanificador(manager, item.itemData['id'], plannData);
          result[item.type] = (result[item.type] || 0) + 1;
          break;
      
        case typeUpdateItem.planificadorCiclo:
          await this.updatesRepo.updatePlanificadorCycle(manager, item.itemData['idPlanificador'], item.itemData['idCiclo']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;
        
        case typeUpdateItem.itemgroup:
          await this.updatesRepo.updateItemGroup(manager, item.itemData as IHanrtItemgroupUpdate);
          result[item.type] = (result[item.type] || 0) + 1;
          break;
        
        case typeUpdateItem.itemruta:
          const itemRuta = item.itemData as IHanrtItemrutaUpdate;
          await this.updatesRepo.updateItemRuta(manager, itemRuta);
          result[item.type] = (result[item.type] || 0) + 1;
          break;
        
        default:
          break;
      }
    }
    return result;
  }

  async updatePlanningDeletes(manager: EntityManager, data: IUpdatePlanningItem[]): Promise<Record<string, number>> {
    const result = {};
    for (let d = 0; d < data.length; d++) {
      const item = data[d];

      switch (item.type) {
        case typeUpdateItem.planificadorVehiculos:
          await this.deletionsRepo.deletePlanificadorVehiculo(manager, item.itemData['id_planificador'], item.itemData['id_vehiculo']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;
      
        case typeUpdateItem.planificadorItemgroup:
          await this.deletionsRepo.deletePlanificadorItemGroup(manager, item.itemData['id_planificador'], item.itemData['id_itemgroup']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemgroup:
          await this.deletionsRepo.deleteItemGroup(manager, item.itemData['id_itemgroup']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;
        
        case typeUpdateItem.itemgroupVehiculos:
          await this.deletionsRepo.deleteItemGroupVehiculo(manager, item.itemData['id_itemgroup'], item.itemData['id_vehiculo']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemgroupItemruta:
          await this.deletionsRepo.deleteItemGroupItemRuta(manager, item.itemData['id_itemgroup'], item.itemData['id_itemruta']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemruta:
          await this.deletionsRepo.deleteItemRuta(manager, item.itemData['id_itemruta']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemrutaAccounts:
          await this.deletionsRepo.deleteItemRutaAccounts(manager, item.itemData['id_itemruta'], item.itemData['id_account']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemrutaContact:
          await this.deletionsRepo.deleteItemRutaContacts(manager, item.itemData['id_itemruta'], item.itemData['id_contact']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemrutaTareasplan:
          await this.deletionsRepo.deleteItemRutaTareasPlan(manager, item.itemData['id_itemruta'], item.itemData['id_tareasplan']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        case typeUpdateItem.itemrutaEntregas:
          await this.deletionsRepo.deleteItemRutaEntrega(manager, item.itemData['id_itemruta'], item.itemData['id_entrega']);
          result[item.type] = (result[item.type] || 0) + 1;
          break;

        default:
          break;
      }
    }
    return result;
  }

  async createItemsRoutesForGroup(manager: EntityManager, item: IUpdatePlanningItem): Promise<number> {
    let inserteds = 0;
    const itemGroup = item.itemData as PlanningRouteDataToUpdate;
    const groupId = await this.insertsRepo.saveItemGroupPlanificador(manager, itemGroup, item.itemData['idPlanificador'])
    const itemRutas = itemGroup.itemrutas || [];
    for (let x = 0; x < itemRutas.length; x++) {
      const ruta = itemRutas[x];
      await this.insertsRepo.saveItemRutaForItemGroup(manager, ruta, groupId)
      inserteds++;
    }
    return inserteds;
  }

  /**
   * Valida si existe algun producto para entregar, para agregar la tarea de entrega
   * @returns {Promise<boolean>} true: Existe algun producto para entregar, false: No existe ningun producto para entregar
   */
  async validateTareaEntregaExists(cycleId: string, visitNumber: number, userId: string, contactId: string): Promise<boolean> {
    const query = `EXEC [map].[validacion_tarea_entrega_contacto] @userId = @0, @cycleId = @1, @visitNumber = @2, @contactId = @3;`;
    const params = [userId, cycleId, visitNumber, contactId];
    const result = await this.mssqlEntityManager.query<{ valid: 0 | 1 }[]>(
      query,
      params,
    );
    if(result.length > 0) 
      return !!(result[0].valid == 1);
    return false; 
  }
}