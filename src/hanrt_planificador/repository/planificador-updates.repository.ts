import { Injectable, Logger } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { HanrtPlanificadorEntity } from "../entities";
import { HanrtCiclosHanrtPlanificadorC } from "../entities/hanrt_ciclos_hanrt_planificador_c.entity";
import { HanrtItemGroupEntity } from "src/hanrt_itemgroup/entities";
import { date_formater } from "src/helpers";
import { IHanrtItemgroupUpdate } from "src/hanrt_itemgroup/interface";
import { IHanrtItemrutaUpdate } from "src/hanrt_itemruta/interfaces";
import { HanrtItemrutaEntity } from "src/hanrt_itemruta/entities";

@Injectable()
export class PlanificadorUpdatesRespository {

  updatePlanificador(manager: EntityManager, idPlanificador: string, data: Partial<HanrtPlanificadorEntity>) {
    return manager.update(HanrtPlanificadorEntity, { id: idPlanificador }, data);
  }

  async updatePlanificadorCycle(manager: EntityManager, idPlanificador: string, idCycle: string) {
    const cycleRelation = await manager.findOneBy(HanrtCiclosHanrtPlanificadorC, { 
      hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb: idPlanificador, 
      deleted: 0 
    });

    if(cycleRelation) {
      if(cycleRelation.hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida !== idCycle) {
        return manager.update(HanrtCiclosHanrtPlanificadorC, {
          id: cycleRelation.id }, {
          hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida: idCycle,
          date_modified: new Date(),
        });
      }
    } else {
      return manager.insert(HanrtCiclosHanrtPlanificadorC, {
        hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb: idPlanificador,
        hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida: idCycle,
        date_modified: new Date(),
        deleted: 0,
        id: crypto.randomUUID(),
      });
    }
  }

  async updateItemGroup(manager: EntityManager, dataItemGroup: IHanrtItemgroupUpdate) {
    const itemgroup = await manager.findOneBy(HanrtItemGroupEntity, {
        id: dataItemGroup.id,
        deleted: 0,
      },
    );

    if (!itemgroup) {
      Logger.debug('No hay grupo', dataItemGroup.id)
      return;
    } 

    dataItemGroup.date_modified = date_formater();

    if (dataItemGroup.hora_fin_c) {
      let dateHoraFin = new Date(dataItemGroup.hora_fin_c);
      dataItemGroup.hora_fin_c = date_formater(dateHoraFin);
    }

    if (dataItemGroup.duracion_c) {
      let dateDuracion = new Date(dataItemGroup.duracion_c);
      dataItemGroup.duracion_c = date_formater(dateDuracion);
    }

    if (dataItemGroup.hora_inicio_c) {
      let dateHoraInicio = new Date(dataItemGroup.hora_inicio_c);
      dataItemGroup.hora_inicio_c = date_formater(dateHoraInicio);
    }

    if (dataItemGroup.secuencia_c) {
      dataItemGroup.secuencia_c = dataItemGroup.secuencia_c.toString();
    }

    const updatedItemgroup = { ...itemgroup, ...dataItemGroup };

    return manager.save(
      HanrtItemGroupEntity,
      updatedItemgroup,
    );
  }

  async updateItemRuta(manager: EntityManager, dataItemRoute: IHanrtItemrutaUpdate) {
    const itemruta = await manager.findOneBy(HanrtItemrutaEntity, {
        id: dataItemRoute.id,
        deleted: 0,
      },
    );

    if (!itemruta){
      Logger.debug('No hay ruta', dataItemRoute.id);
      return;
    } 

    dataItemRoute.date_modified = date_formater();

    if (dataItemRoute.hora_fin_c) {
      let dateHoraFin = new Date(dataItemRoute.hora_fin_c);
      dataItemRoute.hora_fin_c = date_formater(dateHoraFin);
    }

    if (dataItemRoute.duracion_c) {
      let dateDuracion = new Date(dataItemRoute.duracion_c);
      dataItemRoute.duracion_c = date_formater(dateDuracion);
    }

    if (dataItemRoute.hora_inicio_c) {
      let dateHoraInicio = new Date(dataItemRoute.hora_inicio_c);
      dataItemRoute.hora_inicio_c = date_formater(dateHoraInicio);
    }

    if (dataItemRoute.fecha_inicio_c) {
      let dateFechaInicio = new Date(dataItemRoute.fecha_inicio_c);
      dataItemRoute.fecha_inicio_c = date_formater(dateFechaInicio);
    }

    if (dataItemRoute.fecha_fin_c) {
      let dateFechaFin = new Date(dataItemRoute.fecha_fin_c);
      dataItemRoute.fecha_fin_c = date_formater(dateFechaFin);
    }

    const updatedItemgroup = { ...itemruta, ...dataItemRoute };

    return await manager.save(
      HanrtItemrutaEntity,
      updatedItemgroup,
    );
  }
}