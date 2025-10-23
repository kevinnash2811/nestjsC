import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import moment from 'moment';
import { EntityManager } from 'typeorm';
import { v4 as UUID } from 'uuid';
@Injectable()
export class HanrtItemrutaPostV2Service {
  constructor(
    @InjectEntityManager('DBCRM') private readonly entityManager: EntityManager,
  ) {}

  async isPlannedVisit(visitId: string) {
    try {
      const visit = await this.entityManager.query(
        `SELECT * FROM hana_visitas WHERE id NOT IN (@0) AND deleted = 0`,
        [visitId],
      );

      return visit.length > 0;
    } catch (error) {
      throw new Error('Error al verificar la visita: ' + error.message);
    }
  }

  async cloneVisit(visitId: string, newDate: string) {
    try {
      const currentVisit = await this.entityManager.query(
        `SELECT * FROM hana_visitas WHERE id = @0 AND deleted = 0`,
        [visitId],
      );
      if (!currentVisit[0]) {
        throw new Error('Visita no encontrada');
      }

      const newVisit = {
        ...currentVisit[0],
        id: UUID(),
        name: 'Manual',
        es_manual_c: 'yes',
        estado_c: 'POR INICIAR',
        date_entered: new Date(),
        fechainiplan_c: moment(newDate).toDate(),
        date_modified: new Date(),
        fechafinplan_c: moment(newDate).toDate(),
        fechainireal_c: '1900-01-01 04:00:00.000',
        fechafinreal_c: '1900-01-01 04:00:00.000',
      };

      const result = await this.entityManager
        .createQueryBuilder()
        .insert()
        .into('hana_visitas')
        .values(newVisit)
        .execute();

      await this.cloneTasksOfVisit(visitId, newVisit.id);
      await this.entityManager.query(
        `
        UPDATE hana_visitas
        SET hana_visitas_id_c = @0,
        estado_c = 'REPROGRAMADO'
        WHERE id = @1
      `,
        [newVisit.id, visitId],
      );

      return newVisit.id;
    } catch (error) {
      throw new Error('Error al clonar la visita: ' + error.message);
    }
  }

  async cloneTasksOfVisit(oldVisitId: string, newVisitId: string) {
    try {
      const tasksIdMap = new Map<string, string>();
      const tasks = await this.entityManager.query(
        `SELECT * FROM tasks WHERE parent_id = @0 AND deleted = 0 AND parent_type = 'HANA_Visitas'`,
        [oldVisitId],
      );

      const tasks_cstm = await this.entityManager.query(
        `SELECT * FROM tasks_cstm WHERE id_c IN (SELECT id FROM tasks WHERE parent_id = @0 AND deleted = 0 AND parent_type = 'HANA_Visitas')`,
        [oldVisitId],
      );

      for (const task of tasks) {
        const oldTaskId = task.id;
        const newTaskId = UUID();

        tasksIdMap.set(oldTaskId, newTaskId);
        const newTask = {
          ...task,
          id: newTaskId,
          parent_id: newVisitId,
          parent_type: 'HANA_Visitas',
          date_entered: new Date(),
          date_modified: new Date(),
        };

        const modules = await this.entityManager.query(
          `SELECT * FROM hane_entregas WHERE parent_id = @0 AND deleted = 0 AND parent_type = 'Tasks'`,
          [oldTaskId],
        );

        for (const module of modules) {
          const account = await this.entityManager.query(
            `SELECT heac.hane_entregas_accountsaccounts_ida AS accountId FROM hane_entregas he
          JOIN hane_entregas_accounts_c heac ON he.id = heac.hane_entregas_accountshane_entregas_idb
          WHERE he.id = @0 AND he.deleted = 0`,
            [module.id],
          );

          const contact = await this.entityManager.query(
            `SELECT hecc.hane_entregas_contactscontacts_ida AS contactId FROM hane_entregas he
          JOIN hane_entregas_contacts_c hecc ON he.id = hecc.hane_entregas_contactshane_entregas_idb
          WHERE he.id = @0 AND he.deleted = 0`,
            [module.id],
          );

          const newModule = {
            ...module,
            id: UUID(),
            parent_id: newTaskId,
            parent_type: 'Tasks',
            fecha_entrega_c: moment(new Date()).toDate(),
            date_entered: new Date(),
            date_modified: new Date(),
          };

          const keysModule = Object.keys(newModule);
          const valuesModule = Object.values(newModule);

          const result = await this.entityManager.query(
            `
            INSERT INTO hane_entregas (${keysModule.join(', ')})
            VALUES (${valuesModule.map((_, index) => `@${index}`).join(', ')})
          `,
            valuesModule,
          );

          const accountRelation = await this.entityManager
            .createQueryBuilder()
            .insert()
            .into('hane_entregas_accounts_c')
            .values({
              id: UUID(),
              date_modified: new Date(),
              deleted: 0,
              hane_entregas_accountshane_entregas_idb: newModule.id,
              hane_entregas_accountsaccounts_ida: account[0]?.accountId || null,
            })
            .execute();

          const contactRelation = await this.entityManager
            .createQueryBuilder()
            .insert()
            .into('hane_entregas_contacts_c')
            .values({
              id: UUID(),
              date_modified: new Date(),
              deleted: 0,
              hane_entregas_contactshane_entregas_idb: newModule.id,
              hane_entregas_contactscontacts_ida: contact[0]?.contactId || null,
            })
            .execute();

          const products = await this.entityManager.query(
            `
          SELECT * FROM aos_products_quotes apq
          WHERE apq.parent_id = @0 AND apq.deleted = 0
        `,
            [module.id],
          );

          for (const product of products) {
            const newProduct = {
              ...product,
              id: UUID(),
              parent_id: newModule.id,
              date_entered: new Date(),
              date_modified: new Date(),
            };

            // const detalles = await this.entityManager.query(
            //   `SELECT * FROM hanpc_detalleproductoscotizados WHERE parent_id = @0 AND deleted = 0`,
            //   [product.id],
            // );

            // Logger.debug({ detalles: detalles.length });
            // if (detalles.length > 0) {
            //   const detalle = detalles[0];
            //   const newDetalle = {
            //     ...detalle,
            //     id: UUID(),
            //     parent_id: newProduct.id,
            //     date_entered: new Date(),
            //     date_modified: new Date(),
            //   };

            //   const keysDetalle = Object.keys(newDetalle);
            //   const valuesDetalle = Object.values(newDetalle);

            //   await this.entityManager.query(
            //     `
            //     INSERT INTO hanpc_detalleproductoscotizados (${keysDetalle.join(
            //       ', ',
            //     )})
            //     VALUES (${valuesDetalle
            //       .map((_, index) => `@${index}`)
            //       .join(', ')})
            //   `,
            //     valuesDetalle,
            //   );
            // }

            const keys = Object.keys(newProduct);
            const values = Object.values(newProduct);

            await this.entityManager.query(
              `
              INSERT INTO aos_products_quotes (${keys.join(', ')})
              VALUES (${values.map((_, index) => `@${index}`).join(', ')})
            `,
              values,
            );

            await this.entityManager.query(
              `
              INSERT INTO aos_products_quotes_cstm (id_c)
              VALUES (@0)
              `,
              [newProduct.id]
            );
          }

          await this.entityManager.query(
            `
          UPDATE tasks
          SET bean_type = 'HANE_Entregas',
          bean_id = @0
          WHERE id = @1
        `,
            [newModule.id, newTaskId],
          );
        }

        await this.entityManager.insert('tasks', newTask);
      }

      for (const task_cstm of tasks_cstm) {
        const newTaskCstm = {
          ...task_cstm,
          id_c: tasksIdMap.get(task_cstm.id_c) || task_cstm.id_c,
        };

        await this.entityManager.insert('tasks_cstm', newTaskCstm);
      }

      return tasks.length;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getTasksOfVisit(visitId: string) {
    try {
      const sql = `SELECT t.id FROM tasks t WHERE t.parent_id = @0 AND t.deleted = 0 AND t.parent_type = 'HANA_Visitas'`;
      const tasks = await this.entityManager.query(sql, [visitId]);

      return tasks;
    } catch (error) {
      console.log(error);
    }
  }

  async getGetModuleOfTasks(taskId: string, newTaskId: string) {
    try {
      const sql = `SELECT he.id, @1 as taskId FROM hane_entregas he WHERE he.parent_id = @0 AND he.deleted = 0 AND he.parent_type = 'Tasks'`;
      const modules = await this.entityManager.query(sql, [taskId, newTaskId]);

      return modules;
    } catch (error) {
      console.log(error);
    }
  }
}
