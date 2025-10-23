import { EntityManager, In } from 'typeorm';
import {
  HanrtItemrutaAccountsEntity,
  HanrtItemrutaContactsEntity,
  HanrtItemrutaHaneEntregasEntity,
  HanrtItemrutaHanrtTareasPlanEntity,
} from '../entities';
import { HanrtItemgroupHanrtItemrutaEntity } from 'src/hanrt_itemgroup/entities';
import { Logger } from '@nestjs/common';
import { HaneEntregas } from 'src/hane_entregas/entities/hane_entregas.entity';

export class HanrtItemRutaRelationsRepository {
  constructor() {}

  async relationRouteWithGroup(
    routeId: string,
    groupId: string,
    manager: EntityManager,
  ) {
    const exist = await manager.existsBy(HanrtItemgroupHanrtItemrutaEntity, {
      hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida: groupId,
      hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb: routeId,
    });
    if (!exist) {
      await manager.insert(HanrtItemgroupHanrtItemrutaEntity, {
        id: crypto.randomUUID(),
        date_modified: new Date(),
        deleted: 0,
        hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida: groupId,
        hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb: routeId,
      });
    }
  }

  async relationRouteWithDeliveries(
    routeId: string,
    deliveriesId: string[],
    manager: EntityManager,
  ) {
    for (const deliveryId of deliveriesId) {
      Logger.log(
        `Creando relacion delivery ${deliveryId}`,
        'DELIVERY RELATION',
      );
      await this.relationRouteWithDelivery(routeId, deliveryId, manager);
    }
  }

  async relationRouteWithTasks(
    routeId: string,
    tasksId: string[],
    manager: EntityManager,
  ) {
    for (const taskId of tasksId) {
      Logger.log(`Creando relacion tareas ${taskId}`, 'TASKS CREATE');
      await this.relationRouteWithTask(routeId, taskId, manager);
    }
  }

  async relationRouteWithTask(
    routeId: string,
    taskId: string,
    manager: EntityManager,
  ) {
    if (!taskId) return;
    const exist = await manager.existsBy(HanrtItemrutaHanrtTareasPlanEntity, {
      hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: routeId,
      hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: taskId,
    });

    if (!exist) {
      await manager.insert(HanrtItemrutaHanrtTareasPlanEntity, {
        id: crypto.randomUUID(),
        date_modified: new Date(),
        deleted: 0,
        hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: routeId,
        hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: taskId,
      });
    }
  }

  async relationRouteWithDelivery(
    routeId: string,
    deliveryId: string,
    manager: EntityManager,
  ) {
    if (!deliveryId) return;
    const exist = await manager.existsBy(HanrtItemrutaHaneEntregasEntity, {
      hanrt_itemruta_hane_entregashanrt_itemruta_ida: routeId,
      hanrt_itemruta_hane_entregashane_entregas_idb: deliveryId,
    });

    if (!exist) {
      await manager.insert(HanrtItemrutaHaneEntregasEntity, {
        date_modified: new Date(),
        deleted: 0,
        hanrt_itemruta_hane_entregashanrt_itemruta_ida: routeId,
        hanrt_itemruta_hane_entregashane_entregas_idb: deliveryId,
        id: crypto.randomUUID(),
      });
      await manager.update(HaneEntregas, { id: deliveryId }, { estado_c: '07' });
    }
  }

  async relationRouteWithAccount(
    routeId: string,
    accountId: string,
    manager: EntityManager,
  ) {
    if (!accountId) return;
    const exist = await manager.existsBy(HanrtItemrutaAccountsEntity, {
      hanrt_itemruta_accountsaccounts_ida: accountId,
      hanrt_itemruta_accountshanrt_itemruta_idb: routeId,
    });
    if (!exist) {
      await manager.insert(HanrtItemrutaAccountsEntity, {
        id: crypto.randomUUID(),
        date_modified: new Date(),
        deleted: 0,
        hanrt_itemruta_accountsaccounts_ida: accountId,
        hanrt_itemruta_accountshanrt_itemruta_idb: routeId,
      });
    }
  }

  async relationRouteWithContact(
    routeId: string,
    contactId: string,
    manager: EntityManager,
  ) {
    if (!contactId) return;
    const exist = await manager.existsBy(HanrtItemrutaContactsEntity, {
      hanrt_itemruta_contactscontacts_ida: contactId,
      hanrt_itemruta_contactshanrt_itemruta_idb: routeId,
    });
    if (!exist) {
      await manager.insert(HanrtItemrutaContactsEntity, {
        id: crypto.randomUUID(),
        date_modified: new Date(),
        deleted: 0,
        hanrt_itemruta_contactscontacts_ida: contactId,
        hanrt_itemruta_contactshanrt_itemruta_idb: routeId,
      });
    }
  }

  async removeRelationRouteWithGroup(data: {
    routeId: string;
    soft?: boolean;
    manager: EntityManager;
  }) {
    const { routeId, soft = true, manager } = data;
    if (soft) {
      await manager.update(
        HanrtItemgroupHanrtItemrutaEntity,
        { hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb: routeId },
        { date_modified: new Date(), deleted: 1 },
      );
    } else {
      await manager.delete(HanrtItemgroupHanrtItemrutaEntity, {
        hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb: routeId,
      });
    }
  }

  async removeRelationRouteWithTasks(
    routeTaskIds: Record<string, string[]>,
    manager: EntityManager,
    soft?: boolean,
  ) {
    soft = soft ?? true;
    for (const [routeId, taskId] of Object.entries(routeTaskIds)) {
      if (soft) {
        await manager.update(
          HanrtItemrutaHanrtTareasPlanEntity,
          {
            hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: routeId,
            hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: In(taskId),
          },
          { date_modified: new Date(), deleted: 1 },
        );
      } else {
        await manager.delete(HanrtItemrutaHanrtTareasPlanEntity, {
          hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: routeId,
          hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: In(taskId),
        });
      }
    }
  }

  async removeRelationRouteWithAllTasks(data: {
    routeId: string;
    soft?: boolean;
    manager: EntityManager;
  }) {
    const { manager, routeId, soft = true } = data;
    if (soft) {
      await manager.update(
        HanrtItemrutaHanrtTareasPlanEntity,
        { hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: routeId },
        { date_modified: new Date(), deleted: 1 },
      );
    } else {
      await manager.delete(HanrtItemrutaHanrtTareasPlanEntity, {
        hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: routeId,
      });
    }
  }

  async removeRelationRouteWithDeliveries(
    deliveryIds: Record<string, string[]>,
    manager: EntityManager,
    soft?: boolean,
  ) {
    soft = soft ?? true;
    for (const [routeId, deliveryId] of Object.entries(deliveryIds)) {
      if (soft) {
        await manager.update(
          HanrtItemrutaHaneEntregasEntity,
          {
            hanrt_itemruta_hane_entregashanrt_itemruta_ida: routeId,
            hanrt_itemruta_hane_entregashane_entregas_idb: In(deliveryId),
          },
          { date_modified: new Date(), deleted: 1 },
        );
        await manager.update(HaneEntregas, { id: deliveryId }, { estado_c: '03' });
      } else {
        await manager.delete(HanrtItemrutaHaneEntregasEntity, {
          hanrt_itemruta_hane_entregashanrt_itemruta_ida: routeId,
          hanrt_itemruta_hane_entregashane_entregas_idb: In(deliveryId),
        });
        await manager.update(HaneEntregas, { id: deliveryId }, { estado_c: '03' });
      }
    }
  }

  async removeRelationRouteWithAllDeliveries(data: {
    routeId: string;
    soft?: boolean;
    manager: EntityManager;
  }) {
    const { routeId, soft = true, manager } = data;
    const relationRows = await manager.findBy(HanrtItemrutaHaneEntregasEntity, {
      hanrt_itemruta_hane_entregashanrt_itemruta_ida: routeId,
    });

    for (const row of relationRows) {
      if (soft) {
        row.date_modified = new Date();
        row.deleted = 1;
        await manager.save(HanrtItemrutaHaneEntregasEntity, row);
        await manager.update(HaneEntregas, { id: row.hanrt_itemruta_hane_entregashane_entregas_idb }, { estado_c: '03' })
      } else {
        await manager.delete(HanrtItemrutaHaneEntregasEntity, { id: row.id });
        await manager.update(HaneEntregas, { id: row.hanrt_itemruta_hane_entregashane_entregas_idb }, { estado_c: '03' })
      }
    }
  }
}
