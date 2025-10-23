import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IRutaPLanning } from 'src/hanrt_planificador/interface';
import * as querystring from 'node:querystring';
import { IHanrtItemgroup } from '../interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HanrtItemgroupPostService {
  HANSACRM3: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ){
    this.HANSACRM3 = this.configService.get('HANSACRM3');
  }

  async saveItemgroupAllRelationships( idPlanificador: string, rutaPLanning:IRutaPLanning) {
    try {            

      let result;

      rutaPLanning.idPlanificador = idPlanificador;

      await this.httpService.axiosRef.post(`${this.HANSACRM3}service/v4_1/rest.php`,
      querystring.encode(
          {
            input_type : 'Json',
            response_type: 'Json',
            rest_data:`{"data":${JSON.stringify(rutaPLanning)}}`,
            method: "save_itemgroup_all_relationships"
          }
       )
      ) 
      .then((response => { result = response["data"];}))
      .catch((error => { result = error; }));

      return result;

    } catch (error) {console.log(error);}
  }

  async saveItemgroup(hanrtItemgroup:IHanrtItemgroup) {
    try {            
      
      let result;

      await this.httpService.axiosRef.post(`${this.HANSACRM3}service/v4_1/rest.php`,
        querystring.encode(
          {
            input_type : 'Json',
            response_type: 'Json',
            rest_data:`{"data":${JSON.stringify(hanrtItemgroup)}}`,
            method: "save_itemgroup",            
          }
        )                
      ) 
      .then((response => { result = response["data"];}))
      .catch((error => { result = error; }));
      
      return result;

    } catch (error) {console.log(error);}
  }

  async saveRelationshipItemgroupVehiculo(idItemgroup: string, idVehiculo: string) {
    try {            
      
      let result;

     await this.httpService.axiosRef.post(`${this.HANSACRM3}service/v4_1/rest.php`,
      querystring.encode(
          {
            input_type : 'Json',
            response_type: 'Json',
            rest_data:`{"data":{"idItemgroup":"${idItemgroup}","idVehiculo":"${idVehiculo}"}}`,
            method: "save_relationship_itemgroup_vehicle"
          }
        )       
      )
      .then((response => { result = response["data"];}))
      .catch((error => { result = error; }));

      return result;

    } catch (error) {console.log(error); }
  }

  async saveRelationshipItemgroupItemruta(idItemgroup: string, idItemruta: string) {
    try {            
      
      let result;

     await this.httpService.axiosRef.post(`${this.HANSACRM3}service/v4_1/rest.php`,
      querystring.encode(
          {
            input_type : 'Json',
            response_type: 'Json',
            rest_data:`{"data":{"idItemgroup":"${idItemgroup}","idItemruta":"${idItemruta}"}}`,
            method: "save_relationship_itemgroup_itemruta"
          }
        )       
      )
      .then((response => { result = response["data"];}))
      .catch((error => { result = error; }));

      return result;

    } catch (error) {console.log(error); }
  }
}
