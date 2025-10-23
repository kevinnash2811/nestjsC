import { Injectable }             from '@nestjs/common';
import { InjectEntityManager }    from '@nestjs/typeorm';
import { EntityManager }          from 'typeorm';
// import { AccountLatLng }          from '../interface';
import * as queryAccount          from '../../accounts/SQL';
import * as querySQL              from '../SQL';

@Injectable()
export class HaneEntregasGetService {
  constructor(
    @InjectEntityManager('DBCRM') private readonly mssqlEntityManager: EntityManager,
  ){}

  async listHaneEntregasUser(iduser:string){
    try {

      const query = querySQL.hane_entregas.Get_All_Hane_Entregas_User(iduser)
      const data = await this.mssqlEntityManager.query(query);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async haneEntregasGetAll(idaccount:string, date: { from: string | null; to: string | null }){
    try {
      let result = {};

      //**OBTIENE LOS DATOS DE LA CUENTA */
      const query = queryAccount.accounts.Get_Account_Id(idaccount);
      const data = await this.mssqlEntityManager.query(query);
      // Si la consulta devuelve datos, asigna los datos al objeto result
      if (data && data.length > 0) {
        result['info_account'] = data[0]; // Asigna los datos de la cuenta
      } else {
        result['info_account'] = null; // No se encontraron resultados
      }

      //**OBTIENE LOS DATOS DE ÁREA DE VENTAS*/
      const query2 = queryAccount.accounts.Get_Canal_Ventas(idaccount);
      const data2 = await this.mssqlEntityManager.query(query2);
      // Si la consulta devuelve datos, asigna los datos al objeto result
      if (data2 && data2.length > 0) {
        result['area_ventas'] = data2; // Asigna los datos de ventas
      } else {
        result['area_ventas'] = []; // No se encontraron resultados de ventas
      }

      //**OBTIENE LOS DATOS DE ÁREA DE VENTAS*/
      const query3 = queryAccount.accounts.Get_Preferencia_Visita(idaccount, 'T02');
      const data3 = await this.mssqlEntityManager.query(query3);
      // Si la consulta devuelve datos, asigna los datos al objeto result
      if (data3 && data3.length > 0) {
        result['preferencia_visita'] = data3; // Asigna los datos de ventas
      } else {
        result['preferencia_visita'] = []; // No se encontraron resultados de ventas
      }

      //**OBTIENE LAS ENTREGAS PENDIENTES*/
      const query4 = querySQL.hane_entregas.Get_Entregas_Account(idaccount,'03', date.from, date.to);
      const data4 = await this.mssqlEntityManager.query(query4);
      // Si la consulta devuelve datos, asigna los datos al objeto result
      if (data4 && data4.length > 0) {
        result['entregas'] = data4; // Asigna los datos de ventas
      } else {
        result['entregas'] = []; // No se encontraron resultados de ventas
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
