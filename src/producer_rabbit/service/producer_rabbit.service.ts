import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SendPlanningQueueDto } from 'src/hanrt_planificador/dto/send-planning-queue.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as querySQL from '../SQL';
import { Body, TypesPlanning } from '../interface';
import { Type } from 'class-transformer';
@Injectable()
export class ProducerRabbitService {
  constructor(
    @Inject('PLANNING_SERVICE') private readonly clientProxy: ClientProxy,
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

  async getDataByIdPlanificador(body: Body) {
    try {
      const { idPlanificacion } = body;
      //** OBTENEMOS EL REGISTRO DE PLANIFICACIÓN */
      if (idPlanificacion) {
        const query =
          body.typePlanning === TypesPlanning.VISITA
            ? querySQL.item_ruta.GetItemRutaByIdPlanificadorForToday(
                idPlanificacion,
              )
            : querySQL.item_ruta.Get_Item_Ruta_By_Id_Planificador(
                idPlanificacion,
              );
              
        const data_item_ruta = await this.mssqlEntityManager.query(query);
        const data_array: string[] = data_item_ruta.map((obj) => obj.id);

        let sendPlanning = {
          itemrutaList: data_array,
          typePlanning: body.typePlanning,
        };

        return this.sendDataPlanningToQueue(sendPlanning);
      }
      return { message: 'Data Plannning Not Found' };
    } catch (error) {
      console.log(error);
    }
  }

  sendDataPlanningToQueue(data: SendPlanningQueueDto) {
    try {
      this.clientProxy.emit('planning', { data });
      return { message: 'Data Plannning Send To Queue' };
    } catch (error) {
      console.log(error);
    }
  }
}
