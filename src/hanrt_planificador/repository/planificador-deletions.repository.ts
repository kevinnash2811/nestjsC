import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { HanrtPlanificadorHanrtItemgroupEntity, HanrtPlanificadorHansVehiculosEntity } from "../entities";
import { HanrtItemGroupEntity, HanrtItemgroupHanrtItemrutaEntity, HanrtItemgroupHansVehiculosEntity } from "src/hanrt_itemgroup/entities";
import { HanrtItemrutaAccountsEntity, HanrtItemrutaContactsEntity, HanrtItemrutaEntity, HanrtItemrutaHaneEntregasEntity, HanrtItemrutaHanrtTareasPlanEntity } from "src/hanrt_itemruta/entities";

@Injectable()
export class PlanificadorDeletionsRepository {

  deletePlanificadorVehiculo(manager: EntityManager, idPlanificador: string, idVehiculo: string){
    return manager.update(
      HanrtPlanificadorHansVehiculosEntity,
      {
        hanrt_planificador_hans_vehiculoshanrt_planificador_ida:
          idPlanificador,
        hanrt_planificador_hans_vehiculoshans_vehiculos_idb: idVehiculo,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }

  deletePlanificadorItemGroup(manager: EntityManager, idPlanificador: string, idItemGroup: string) {
    return manager.update(
      HanrtPlanificadorHanrtItemgroupEntity,
      {
        hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida:
          idPlanificador,
        hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb: idItemGroup,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }

  deleteItemGroup(manager: EntityManager, idItemGroup: string) {
    return manager.update(
      HanrtItemGroupEntity,
      {
        id: idItemGroup,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }

  deleteItemGroupVehiculo(manager: EntityManager, idItemGroup: string, idVehiculo: string) {
    return manager.update(
      HanrtItemgroupHansVehiculosEntity,
      {
        hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida: idVehiculo,
        hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb: idItemGroup,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }

  deleteItemGroupItemRuta(manager: EntityManager, idItemGroup: string, idItemRuta: string) {
    return manager.update(
      HanrtItemgroupHanrtItemrutaEntity,
      {
        hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida: idItemGroup,
        hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb: idItemRuta,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }

  deleteItemRuta(manager: EntityManager, idItemRuta: string) {
    return manager.update(
      HanrtItemrutaEntity,
      {
        id: idItemRuta,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }

  deleteItemRutaAccounts(manager: EntityManager, idItemRuta: string, idAccount: string) {
    return manager.update(
      HanrtItemrutaAccountsEntity,
      {
        hanrt_itemruta_accountsaccounts_ida: idAccount,
        hanrt_itemruta_accountshanrt_itemruta_idb: idItemRuta,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }

  deleteItemRutaContacts(manager: EntityManager, idItemRuta: string, idContact: string) {
    return manager.update(
      HanrtItemrutaContactsEntity,
      {
        hanrt_itemruta_contactscontacts_ida: idContact,
        hanrt_itemruta_contactshanrt_itemruta_idb: idItemRuta,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }

  deleteItemRutaTareasPlan(manager: EntityManager, idItemRuta: string, idTareaPlan: string) {
    return manager.update(
      HanrtItemrutaHanrtTareasPlanEntity,
      {
        hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: idItemRuta,
        hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: idTareaPlan,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }

  deleteItemRutaEntrega(manager: EntityManager, idItemRuta: string, idEntrega: string) {
    return manager.update(
      HanrtItemrutaHaneEntregasEntity,
      {
        hanrt_itemruta_hane_entregashanrt_itemruta_ida: idItemRuta,
        hanrt_itemruta_hane_entregashane_entregas_idb: idEntrega,
        deleted: 0,
      },
      { deleted: 1, date_modified: new Date() },
    );
  }
}