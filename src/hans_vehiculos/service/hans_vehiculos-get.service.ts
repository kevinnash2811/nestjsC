import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import * as querySQL from '../SQL'

@Injectable()
export class HansVehiculosGetService {

  constructor(
    @InjectEntityManager('DBCRM') private readonly mssqlEntityManager: EntityManager,
  ){}

  async getHansVehiculosData(plate:string){
    try {
      let result = {};

      const query = querySQL.hans_vehiculos.Get_Hans_Vehiculos_Data(plate);
      const data = await this.mssqlEntityManager.query(query);
      if (data && data.length > 0) {
        result['hans_vehiculo_data'] = data[0];
      } else {
        result['message'] = 'LA PLACA NO PERTENECE A NINGUN VEHICULO';
        return result;
      }

      const idHansVehiculo: string= result['hans_vehiculo_data'].id_vehiculo;
      const query2 = querySQL.hans_vehiculos.Get_Hans_Vehiculos_Drivers(idHansVehiculo);
      const data2 = await this.mssqlEntityManager.query(query2);
      if (data2 && data2.length > 0) {
        result['conductores'] = data2; 
      } else {
        result['message'] = 'EL VEHICULO NO TIENE CONDUCTORES ASOCIADOS'; 
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}