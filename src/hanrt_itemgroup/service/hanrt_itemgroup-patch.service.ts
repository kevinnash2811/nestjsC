import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IHanrtItemgroupUpdate } from '../interface';
import {
  HanrtItemGroupEntity,
  HanrtItemgroupHanrtItemrutaEntity,
  HanrtItemgroupHansVehiculosEntity,
} from '../entities';
import { date_formater } from 'src/helpers';

@Injectable()
export class HanrtItemgroupPatchService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

  async updateItemgroup(hanrtItemgroup: IHanrtItemgroupUpdate) {
    try {
      const itemgroup = await this.mssqlEntityManager.findOneBy(
        HanrtItemGroupEntity,
        {
          id: hanrtItemgroup.id,
          deleted: 0,
        },
      );

      if (!itemgroup) return 'itemgroup no encontrado';

      hanrtItemgroup.date_modified = date_formater();

      if (hanrtItemgroup.hora_fin_c) {
        let dateHoraFin = new Date(hanrtItemgroup.hora_fin_c);
        hanrtItemgroup.hora_fin_c = date_formater(dateHoraFin);
      }

      if (hanrtItemgroup.duracion_c) {
        let dateDuracion = new Date(hanrtItemgroup.duracion_c);
        hanrtItemgroup.duracion_c = date_formater(dateDuracion);
      }

      if (hanrtItemgroup.hora_inicio_c) {
        let dateHoraInicio = new Date(hanrtItemgroup.hora_inicio_c);
        hanrtItemgroup.hora_inicio_c = date_formater(dateHoraInicio);
      }

      if (hanrtItemgroup.secuencia_c) {
        hanrtItemgroup.secuencia_c = hanrtItemgroup.secuencia_c.toString();
      }

      const updatedItemgroup = { ...itemgroup, ...hanrtItemgroup };

      return await this.mssqlEntityManager.save(
        HanrtItemGroupEntity,
        updatedItemgroup,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItemgroup(idItemgroup: string) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtItemGroupEntity,
        {
          id: idItemgroup,
          deleted: 0,
        },
        { deleted: 1, date_modified },
      );

      if (result.affected === 0)
        return { success: false, message: 'Registro no borrado', affected: 0 };

      return {
        success: true,
        message: 'Registro Borrado',
        affected: result.affected,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItemgroupVehiculos(idItemgroup: string, idVehiculo: string) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtItemgroupHansVehiculosEntity,
        {
          hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida: idVehiculo,
          hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb: idItemgroup,
          deleted: 0,
        },
        { deleted: 1, date_modified },
      );

      if (result.affected === 0)
        return { success: false, message: 'Registro no borrado', affected: 0 };

      return {
        success: true,
        message: 'Registro Borrado',
        affected: result.affected,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItemgroupItemruta(idItemgroup: string, idItemruta: string) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtItemgroupHanrtItemrutaEntity,
        {
          hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida: idItemgroup,
          hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb: idItemruta,
          deleted: 0,
        },
        { deleted: 1, date_modified },
      );

      if (result.affected === 0)
        return { success: false, message: 'Registro no borrado', affected: 0 };

      return {
        success: true,
        message: 'Registro Borrado',
        affected: result.affected,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
