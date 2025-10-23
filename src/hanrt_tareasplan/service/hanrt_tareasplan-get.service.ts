import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as querySQL  from '../SQL';

@Injectable()
export class TasksGetService {

  constructor(
    @InjectEntityManager('DBCRM') private readonly mssqlEntityManager: EntityManager,
  ) { }

  async getList(tipoTarea: string) {
    try {
      //** OBTENEMOS EL LISTADO DE TAREAS */
      const query            = querySQL.tasks.getList(tipoTarea);
      const data_tiposTarea  = await this.mssqlEntityManager.query(query);
      return data_tiposTarea
    } catch (error) {
      console.log(error);
    }
  }

  async getListTareasPlan(hanrtTareasPlanDto:{tipoTarea?: string, tareaPara?: string, fechaInicio?: string, fechaFin?: string}) {
    try {
      //**OBTIENE EL LISTADO DE TAREAS PLAN */
      const { tipoTarea, tareaPara, fechaInicio, fechaFin} = hanrtTareasPlanDto;
      const query                   = querySQL.tasks.getListTareasPlan(tipoTarea, tareaPara, fechaInicio, fechaFin);
      const data_tareasPlan         = await this.mssqlEntityManager.query(query);
      return data_tareasPlan;
    } catch (error) {
      console.log(error);
    }
  }
}
