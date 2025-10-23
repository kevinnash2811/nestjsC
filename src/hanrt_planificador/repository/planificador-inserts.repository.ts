import { Injectable, Logger } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { HanrtPlanificadorHanrtItemgroupEntity, HanrtPlanificadorHansVehiculosEntity } from "../entities";
import { IHanrtItemgroup } from "src/hanrt_itemgroup/interface";
import { HanrtItemGroupEntity, HanrtItemgroupHanrtItemrutaEntity, HanrtItemgroupHansVehiculosEntity } from "src/hanrt_itemgroup/entities";
import { HanrtItemrutaAccountsEntity, HanrtItemrutaContactsEntity, HanrtItemrutaEntity, HanrtItemrutaHaneEntregasEntity, HanrtItemrutaHanrtTareasPlanEntity } from "src/hanrt_itemruta/entities";
import { PlanningRouteItemData } from "../interface";

@Injectable()
export class PlanificadorInsertsRepository {
  
  async saveRelationPlanificadorVehiculo(manager: EntityManager, idVehiculo: string, idPlanificador: string) {
    const exist = await manager.findOne(HanrtPlanificadorHansVehiculosEntity, {
      where: {
        hanrt_planificador_hans_vehiculoshanrt_planificador_ida: idPlanificador,
        hanrt_planificador_hans_vehiculoshans_vehiculos_idb: idVehiculo,
      },
    });
    if (exist) return;
    
    return manager.insert(HanrtPlanificadorHansVehiculosEntity, {
      id: crypto.randomUUID(),
      date_modified: new Date(),
      deleted: 0,
      hanrt_planificador_hans_vehiculoshanrt_planificador_ida: idPlanificador,
      hanrt_planificador_hans_vehiculoshans_vehiculos_idb: idVehiculo,
    })
  }

  async saveItemGroupPlanificador(manager: EntityManager, dataItemGroup: IHanrtItemgroup, idPlanificador: string): Promise<string> {
    const generatedId = crypto.randomUUID();
    Logger.debug(`Creacion nuevo grupo planificacion`, generatedId);
    await manager.insert(HanrtItemGroupEntity, {
      assigned_user_id: dataItemGroup.userId,
      date_entered: new Date(),
      date_modified: new Date(),
      description: dataItemGroup.description,
      duracion_c: dataItemGroup.duracionC,
      id: generatedId,
      name: dataItemGroup.name,
      bloqueado_c: dataItemGroup.bloqueadoC+'',
      fecha_plan_c: dataItemGroup.fechaPlanC,
      capacidad_c: dataItemGroup.capacidadC,
      hora_inicio_c: dataItemGroup.horaInicioC,
      hora_fin_c: dataItemGroup.horaFinC,
      secuencia_c: dataItemGroup.secuenciaC+'',
      created_by: dataItemGroup.userId,
      modified_user_id: dataItemGroup.userId,
      deleted: 0,
    })

    await manager.insert(HanrtPlanificadorHanrtItemgroupEntity, {
      date_modified: new Date(),
      deleted: 0,
      hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb: generatedId,
      hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida: idPlanificador,
      id: crypto.randomUUID(),
    });

    if(dataItemGroup.idVehiculo) {
      await manager.insert(HanrtItemgroupHansVehiculosEntity, {
        date_modified: new Date(),
        deleted: 0,
        hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb: generatedId,
        hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida: dataItemGroup.idVehiculo,
        id: crypto.randomUUID(),
      })
      await this.saveRelationPlanificadorVehiculo(manager, dataItemGroup.idVehiculo, idPlanificador);
    }
    return generatedId;
  }

  saveRelationItemRouteAccount(manager: EntityManager, idItemGroup: string, idAccount: string) {
    return manager.insert(HanrtItemrutaAccountsEntity, {
      date_modified: new Date(),
      deleted: 0,
      hanrt_itemruta_accountsaccounts_ida: idAccount,
      hanrt_itemruta_accountshanrt_itemruta_idb: idItemGroup,
      id: crypto.randomUUID(),
    })
  }

  saveRelationItemRouteContact(manager: EntityManager, idItemGroup: string, idContact: string) {
    return manager.insert(HanrtItemrutaContactsEntity,
        {
          id: crypto.randomUUID(),
          date_modified: new Date(),
          deleted: 0,
          hanrt_itemruta_contactscontacts_ida: idContact,
          hanrt_itemruta_contactshanrt_itemruta_idb: idItemGroup,
        },
      );
  }

  saveRelationItemRutaEntrega(manager: EntityManager, idItemRuta: string, idEntrega: string) {
    return manager.insert(HanrtItemrutaHaneEntregasEntity,
      {
        date_modified: new Date(),
        deleted: 0,
        hanrt_itemruta_hane_entregashane_entregas_idb: idEntrega,
        hanrt_itemruta_hane_entregashanrt_itemruta_ida: idItemRuta,
        id: crypto.randomUUID(),
      }
    );
  }

  async saveRelationItemRutaTareaPlan(manager: EntityManager, idItemRuta: string, idTarea: string) {
    const relationExists = await manager.findOne(HanrtItemrutaHanrtTareasPlanEntity, {
      where: {
        hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: idItemRuta,
        hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: idTarea,
        deleted: 0,
      }
    });
    if(relationExists) return relationExists;

    return manager.insert(HanrtItemrutaHanrtTareasPlanEntity,
      {
        id: crypto.randomUUID(),
        date_modified: new Date(),
        deleted: 0,
        hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: idItemRuta,
        hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: idTarea,
      },
    );
  }

  async saveItemRutaForItemGroup(manager: EntityManager, itemRuta: PlanningRouteItemData, groupId: string): Promise<string> {
    if(!groupId) throw new Error('Needed ID GROUP for create route');
    const id = crypto.randomUUID();
    await manager.insert(HanrtItemrutaEntity, {
        name: itemRuta.name,
        description: itemRuta.description,
        tipo_visita_c: itemRuta.tipoVisitaC,
        tipo_visita_hbm_c: itemRuta.tipoVisitaHbmC,
        fecha_inicio_c: new Date(
          new Date(itemRuta.fechaInicioC).setHours(
            new Date(itemRuta.fechaInicioC).getHours() + 4,
          ),
        ),
        hora_inicio_c: new Date(
          new Date(itemRuta.horaInicioC).setHours(
            new Date(itemRuta.horaInicioC).getHours() + 4,
          ),
        ),
        duracion_c: new Date(
          new Date(itemRuta.duracionC).setHours(
            new Date(itemRuta.duracionC).getHours() + 4,
          ),
        ),
        fecha_fin_c: new Date(
          new Date(itemRuta.fechaFinC).setHours(
            new Date(itemRuta.fechaFinC).getHours() + 4,
          ),
        ),
        hora_fin_c: new Date(
          new Date(itemRuta.horaFinC).setHours(
            new Date(itemRuta.horaFinC).getHours() + 4,
          ),
        ),
        secuencia_c: itemRuta.secuenciaC,
        assigned_user_id: itemRuta.userId,
        jjwg_maps_lat_c: itemRuta.latitud ? itemRuta.latitud.toString() : '',
        jjwg_maps_lng_c: itemRuta.longitud ? itemRuta.longitud.toString() : '',
        deleted: 0,
        date_modified: new Date(),
        created_by: itemRuta.userId,
        date_entered: new Date(),
        id,
        modified_user_id: itemRuta.userId,
      }
    )

    await manager.insert(HanrtItemgroupHanrtItemrutaEntity, {
      date_modified: new Date(),
      deleted: 0,
      hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida: groupId,
      hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb: id,
      id: crypto.randomUUID(),
    })

    if(itemRuta.idAccount) {
      await this.saveRelationItemRouteAccount(manager, id, itemRuta.idAccount)
    }

    if(itemRuta.idContact) {
      await this.saveRelationItemRouteContact(manager, id, itemRuta.idContact);
    }

    if(itemRuta.entregas){
      for(let i = 0, len = itemRuta.entregas.length; i < len; i++) {
        const entregaId = itemRuta.entregas[i];
        await this.saveRelationItemRutaEntrega(manager, id, entregaId)
      }
    }

    if(itemRuta.tareasPlan){
      for(let i = 0, len = itemRuta.tareasPlan.length; i < len; i++) {
        const tareaId = itemRuta.tareasPlan[i];
        await this.saveRelationItemRutaTareaPlan(manager, id, tareaId);
      }
    }

    return id;
  }

  async saveRelationItemGroupVehiculo(manager: EntityManager, itemGroupId: string, idVehiculo: string): Promise<void>{
    await manager.insert(HanrtItemgroupHansVehiculosEntity, {
      date_modified: new Date(),
      deleted: 0,
      hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb: itemGroupId,
      hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida: idVehiculo,
      id: crypto.randomUUID(),
    })
  }

}