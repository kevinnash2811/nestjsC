import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';
import * as querySQL from '../SQL';
import { UserCRM } from '../interface';
import { NacosConfigClient } from 'nacos';
import { AppConfig, NacosModel } from 'src/types';
import { ConfigService } from '@nestjs/config';
import { merge } from 'lodash';
@Injectable()
export class UsersGetService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getInfoUser(iduser: string) {
    try {
      let userCRM: UserCRM;
      let token = '';

      //*OBTENEMOS LA INFORMACION DEL USUARIO LOGUEADO
      const query = querySQL.users.Get_User(iduser);
      const data = await this.mssqlEntityManager.query<UserCRM[] | undefined>(
        query,
      );
      // Si la consulta devuelve datos, asigna los datos al objeto result
      if (data && data.length > 0) {
        userCRM = data[0]; // Asigna los datos de la cuenta
        token = await this.jwtService.signAsync(userCRM);
      } else {
        return new HttpException(
          'No se encontraron datos para el usuario',
          404,
        );
      }

      //**OBTENEMOS LOS USUARIOS DEL reports_to_id */}
      const query_users = querySQL.users.Get_All_User('', '', iduser);
      const data_users = await this.mssqlEntityManager.query(query_users);

      // Inicializar reports_to_id como un array vacío si no hay datos
      if (
        userCRM?.rol_hbm_c === 'SSFFVV' ||
        userCRM?.rol_hbm_c === 'SSFFVVI' ||
        userCRM?.rol_hbm_c === 'SSFFVVC' ||
        userCRM?.rol_hbm_c === 'ADM' ||
        userCRM?.rol_hbm_c === 'SHYV' ||
        userCRM?.rol_hbm_c === 'SAPV'
      ) {
        userCRM.reports_to_id =
          data_users && data_users.length > 0 ? data_users : [];
      } else {
        userCRM['reports_to_id'] = [];
      }

      // Crear la sesión de usuario
      const user_session = {
        id: userCRM.id,
        user_name: `${userCRM.nombres?.concat(' ') ?? ''}${userCRM.apellidos}`,
        division: userCRM.division,
        a_mercado: userCRM.amercado,
        avatar: userCRM.avatar,
        employee_status: userCRM.estado,
        cargo: userCRM.rol,
        iddivision_c: userCRM.iddivision,
        idamercado_c: userCRM.idamercado,
        idgrupocliente_c: userCRM.idgrupocliente,
        idregional_c: userCRM.idregional,
        idvendedor_c: userCRM.codigo_vendedor,
        email: userCRM.email,
      };
      userCRM.reports_to_id.push(user_session);

      userCRM.reports_id = userCRM.reports_to_id.map((report) => report.id);

      userCRM['ciclos'] = JSON.parse(data[0].ciclos);
      const queryByZones = `
        SELECT
          DISTINCT 
          hl.ID,
          hl.ListId,
          hl.ListType,
          hl.Value
        FROM
          pro.hansacrm_list hl
        LEFT JOIN hana_relaciones_accounts_c hrac 
        ON
          hrac.zona_ventas_c = hl.ID
          AND hrac.deleted = 0
        LEFT JOIN hana_relaciones hr ON
          hr.id = hrac.hana_relaciones_accountshana_relaciones_idb
          AND hr.deleted = 0
        LEFT JOIN hanit_interlocutores_hana_relaciones_c hihrc ON
          hihrc.hanit_interlocutores_hana_relacioneshana_relaciones_ida = hr.id
          AND hihrc.deleted = 0
        LEFT JOIN hanit_interlocutores hi ON
          hi.id = hihrc.hanit_interlocutores_hana_relacioneshanit_interlocutores_idb
          AND hi.deleted = 0
        WHERE
          hl.ListId = 'hansa_dimzona_ventas_list'
          AND 
          hi.assigned_user_id IN (SELECT slipt FROM dbo.[fn_Util_Slipt]('${
            userCRM?.reports_id ?? []
          }',	','))
        `;

      const dataZones = await this.mssqlEntityManager.query(queryByZones);
      userCRM.zona_ventas_c =
        dataZones && dataZones.length > 0 ? dataZones : [];
      return {
        userCRM,
        token,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers(division: string, amercado: string) {
    try {
      const query = querySQL.users.Get_All_User(division, amercado);
      const data = await this.mssqlEntityManager.query(query);
      if (data && data.length > 0) {
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getUsersByCiclo(idCiclo: string) {
    try {
      const query = querySQL.users.getUsersBy_Ciclo(idCiclo);
      const data = await this.mssqlEntityManager.query(query);
      if (data && data.length > 0) {
        return data;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getUserConfigs(id: string) {
    try {
      const data = await this.mssqlEntityManager.query(
        querySQL.users.getDataForConfig(id),
      );
      if (data && data.length > 0) {
        const rules = this.configService.get<string>('planificador.rules');

        Logger.debug(rules);

        return Object.entries(rules).reduce((acc, [key, value]) => {
          acc[key] = value.includes(data[0].rol_hbm_c);
          return acc;
        }, {});
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error al obtener la configuración del usuario',
        500,
      );
    }
  }
}
