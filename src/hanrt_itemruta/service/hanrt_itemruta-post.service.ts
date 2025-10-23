import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as querystring from 'node:querystring';
import { IHanrtItemruta } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  HanrtItemrutaContactsEntity,
  HanrtItemrutaEntity,
  HanrtItemrutaHanrtTareasPlanEntity,
} from '../entities';
import { v4 as UUID } from 'uuid';

@Injectable()
export class HanrtItemrutaPostService {
  HANSACRM3: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectEntityManager('DBCRM') private readonly entityManager: EntityManager,
  ) {
    this.HANSACRM3 = this.configService.get('HANSACRM3');
  }

  async saveItemruta(hanrtItemruta: IHanrtItemruta) {
    try {
      const id = UUID();
      const result = await this.entityManager.insert(HanrtItemrutaEntity, {
        name: hanrtItemruta.name,
        description: hanrtItemruta.description,
        tipo_visita_c: hanrtItemruta.tipoVisitaC,
        tipo_visita_hbm_c: hanrtItemruta.tipoVisitaHbmC,
        fecha_inicio_c: new Date(
          new Date(hanrtItemruta.fechaInicioC).setHours(
            new Date(hanrtItemruta.fechaInicioC).getHours() + 4,
          ),
        ),
        hora_inicio_c: new Date(
          new Date(hanrtItemruta.horaInicioC).setHours(
            new Date(hanrtItemruta.horaInicioC).getHours() + 4,
          ),
        ),
        duracion_c: new Date(
          new Date(hanrtItemruta.duracionC).setHours(
            new Date(hanrtItemruta.duracionC).getHours() + 4,
          ),
        ),
        fecha_fin_c: new Date(
          new Date(hanrtItemruta.fechaFinC).setHours(
            new Date(hanrtItemruta.fechaFinC).getHours() + 4,
          ),
        ),
        hora_fin_c: new Date(
          new Date(hanrtItemruta.horaFinC).setHours(
            new Date(hanrtItemruta.horaFinC).getHours() + 4,
          ),
        ),
        secuencia_c: hanrtItemruta.secuenciaC,
        assigned_user_id: hanrtItemruta.userId,
        jjwg_maps_lat_c: hanrtItemruta.latitud,
        jjwg_maps_lng_c: hanrtItemruta.longitud,
        deleted: 0,
        date_modified: new Date(),
        created_by: hanrtItemruta.userId,
        date_entered: new Date(),
        id,
        modified_user_id: hanrtItemruta.userId,
      });

      return {
        id_created_itemruta: id,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async saveRelationshipItemrutaAccounts(
    idItemruta: string,
    idAccount: string,
  ) {
    try {
      let result;

      await this.httpService.axiosRef
        .post(
          `${this.HANSACRM3}service/v4_1/rest.php`,
          querystring.encode({
            input_type: 'Json',
            response_type: 'Json',
            rest_data: `{"data":{"idItemruta":"${idItemruta}","idAccount":"${idAccount}"}}`,
            method: 'save_relationship_itemruta_account',
          }),
        )
        .then((response) => {
          result = response['data'];
        })
        .catch((error) => {
          result = error;
        });

      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async saveRelationshipItemrutaContact(idItemruta: string, idContact: string) {
    try {
      const relation = await this.entityManager.insert(
        HanrtItemrutaContactsEntity,
        {
          id: UUID(),
          date_modified: new Date(),
          deleted: 0,
          hanrt_itemruta_contactscontacts_ida: idContact,
          hanrt_itemruta_contactshanrt_itemruta_idb: idItemruta,
        },
      );

      return relation;
    } catch (error) {
      console.log(error);
    }
  }

  async saveRelationshipItemrutaTareasplan(
    idItemruta: string,
    idTareasplan: string,
  ) {
    try {
      const relation = await this.entityManager.insert(
        HanrtItemrutaHanrtTareasPlanEntity,
        {
          id: UUID(),
          date_modified: new Date(),
          deleted: 0,
          hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: idItemruta,
          hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: idTareasplan,
        },
      );

      return relation;
    } catch (error) {
      console.log(error);
    }
  }

  async saveRelationshipItemrutaEntregas(
    idItemruta: string,
    idEntrega: string,
  ) {
    try {
      let result;

      await this.httpService.axiosRef
        .post(
          `${this.HANSACRM3}service/v4_1/rest.php`,
          querystring.encode({
            input_type: 'Json',
            response_type: 'Json',
            rest_data: `{"data":{"idItemruta":"${idItemruta}","idEntrega":"${idEntrega}"}}`,
            method: 'save_relationship_itemruta_delivery',
          }),
        )
        .then((response) => {
          result = response['data'];
        })
        .catch((error) => {
          result = error;
        });

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
