import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IHanrtItemrutaUpdate } from '../interfaces';
import {
  HanrtItemrutaAccountsEntity,
  HanrtItemrutaEntity,
  HanrtItemrutaHaneEntregasEntity,
  HanrtItemrutaHanrtTareasPlanEntity,
} from '../entities';
import { date_formater } from 'src/helpers';
import { HanrtItemRutaRepository } from '../repository/itemruta.repository';
import { VisitUpdateOrder } from '../types';

@Injectable()
export class HanrtItemrutaPatchService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly hanrtItemRutaRepository: HanrtItemRutaRepository,
  ) {}

  async updateItemruta(hanrtItemruta: IHanrtItemrutaUpdate) {
    try {
      const itemruta = await this.mssqlEntityManager.findOneBy(
        HanrtItemrutaEntity,
        {
          id: hanrtItemruta.id,
          deleted: 0,
        },
      );

      if (!itemruta) return 'itemruta no encontrado';

      hanrtItemruta.date_modified = date_formater();

      if (hanrtItemruta.hora_fin_c) {
        let dateHoraFin = new Date(hanrtItemruta.hora_fin_c);
        hanrtItemruta.hora_fin_c = date_formater(dateHoraFin);
      }

      if (hanrtItemruta.duracion_c) {
        let dateDuracion = new Date(hanrtItemruta.duracion_c);
        hanrtItemruta.duracion_c = date_formater(dateDuracion);
      }

      if (hanrtItemruta.hora_inicio_c) {
        let dateHoraInicio = new Date(hanrtItemruta.hora_inicio_c);
        hanrtItemruta.hora_inicio_c = date_formater(dateHoraInicio);
      }

      if (hanrtItemruta.fecha_inicio_c) {
        let dateFechaInicio = new Date(hanrtItemruta.fecha_inicio_c);
        hanrtItemruta.fecha_inicio_c = date_formater(dateFechaInicio);
      }

      if (hanrtItemruta.fecha_fin_c) {
        let dateFechaFin = new Date(hanrtItemruta.fecha_fin_c);
        hanrtItemruta.fecha_fin_c = date_formater(dateFechaFin);
      }

      const updatedItemgroup = { ...itemruta, ...hanrtItemruta };

      return await this.mssqlEntityManager.save(
        HanrtItemrutaEntity,
        updatedItemgroup,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItemruta(idItemruta: string) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtItemrutaEntity,
        {
          id: idItemruta,
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

  async deleteItemrutaAccounts(idItemruta: string, idAccount: string) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtItemrutaAccountsEntity,
        {
          hanrt_itemruta_accountsaccounts_ida: idAccount,
          hanrt_itemruta_accountshanrt_itemruta_idb: idItemruta,
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

  async deleteItemrutaContact(idItemruta: string, idContact: string) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtItemrutaAccountsEntity,
        {
          hanrt_itemruta_contactscontacts_ida: idContact,
          hanrt_itemruta_contactshanrt_itemruta_idb: idItemruta,
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

  async deleteItemrutaTareasplan(idItemruta: string, idTareasplan: string) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtItemrutaHanrtTareasPlanEntity,
        {
          hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: idItemruta,
          hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: idTareasplan,
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

  async deleteItemrutaEntregas(idItemruta: string, idEntrega: string) {
    try {
      let date_modified = date_formater();

      const result = await this.mssqlEntityManager.update(
        HanrtItemrutaHaneEntregasEntity,
        {
          hanrt_itemruta_hane_entregashanrt_itemruta_ida: idItemruta,
          hanrt_itemruta_hane_entregashane_entregas_idb: idEntrega,
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

  async reorderRoutes(orderedRoute: VisitUpdateOrder[]) {
    try {
      const result = await this.hanrtItemRutaRepository.reorderRoutes(
        orderedRoute,
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
