import { Injectable }             from '@nestjs/common';
import { InjectEntityManager }    from '@nestjs/typeorm';
import { EntityManager }          from 'typeorm';
import { AccountLatLng }          from '../interface';
import * as querySQL              from '../SQL';
import { AccountRepository } from '../repository/account.repository';

@Injectable()
export class AccountsGetService {

  constructor(
    @InjectEntityManager('DBCRM') private readonly mssqlEntityManager: EntityManager,
    private readonly accRepo: AccountRepository
  ){}
  
  async listAccountsUser(iduser:string){
    try {
      let data: AccountLatLng[];
      if(iduser){
        const query = querySQL.accounts.Get_All_Accounts_User(iduser);
        data = await this.mssqlEntityManager.query(query);
      }else{
        data = await this.mssqlEntityManager.query(querySQL.accounts.Get_All_Accounts);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async accountGetAll(idaccount:string){
    try {
      let result = {};

      //**OBTIENE LOS DATOS DE LA CUENTA */
      const query = querySQL.accounts.Get_Account_Id(idaccount);
      const data = await this.mssqlEntityManager.query(query);
      // Si la consulta devuelve datos, asigna los datos al objeto result
      if (data && data.length > 0) {
        result['info_account'] = data[0]; // Asigna los datos de la cuenta
      } else {
        result['info_account'] = null; // No se encontraron resultados
      }

      //**OBTIENE LOS DATOS DE ÁREA DE VENTAS*/
      const query2 = querySQL.accounts.Get_Canal_Ventas(idaccount);
      const data2 = await this.mssqlEntityManager.query(query2);
      // Si la consulta devuelve datos, asigna los datos al objeto result
      if (data2 && data2.length > 0) {
        result['area_ventas'] = data2; // Asigna los datos de ventas
      } else {
        result['area_ventas'] = []; // No se encontraron resultados de ventas
      }

      //**OBTIENE LOS DATOS DE PREFERENCIA DE VISITA*/
      const query3 = querySQL.accounts.Get_Preferencia_Visita(idaccount, 'T01');
      const data3 = await this.mssqlEntityManager.query(query3);
      // Si la consulta devuelve datos, asigna los datos al objeto result
      if (data3 && data3.length > 0) {
        result['preferencia_visita'] = data3; // Asigna los datos de ventas
      } else {
        result['preferencia_visita'] = []; // No se encontraron resultados de ventas
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async getAccountContacts(idaccount: string){
    return this.accRepo.findAccountContacts(idaccount);
  }
  async getContactAccounts(contactid: string){
    return this.accRepo.findContactAccounts(contactid);
  }
}
