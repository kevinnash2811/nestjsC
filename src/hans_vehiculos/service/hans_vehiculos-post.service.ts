import { cleanSpecialCharacters } from '../../helpers'
import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { FilterAdvancedVehiculosDto } from "../dto";
import { ConfigService } from '@nestjs/config';


@Injectable()
export class HansVehiculosPostService {
  SQL_DATABASE: string;
  SQL_SCHEMA: string;

  constructor(
    @InjectEntityManager('DBCRM') private readonly mssqlEntityManager: EntityManager,
    private readonly configService: ConfigService,
  ){
    this.SQL_DATABASE = this.configService.get('SQL_DATABASE');
    this.SQL_SCHEMA = this.configService.get('SQL_SCHEMA');
  }
  
  async listHansVehiculos(filterAdvancedVehiculosDto: FilterAdvancedVehiculosDto){
    try {
      const {page, rowsPerPage, filter, sortBy, order } = filterAdvancedVehiculosDto;

      const {
        easyFilter = '',
        assigned_to = '',
        regional = '',
        state = ''
      } = filter;

      const data= await this.mssqlEntityManager.query(`EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Hans_Vehiculos_Filter_Advanced]
         ${page},
         ${rowsPerPage},
        '${sortBy}',
        '${order}',
        '${cleanSpecialCharacters(easyFilter)}',
        '${regional}',
        '${state ?? ''}',
        '${assigned_to}'`);

      return data.map(e => ({
        ...e,
        conductores: JSON.parse(e.conductores),
      }))
    } catch (error) {
      console.log(error);
    }
  }

  async listTotalHansVehiculos(filterAdvancedVehiculosDto: FilterAdvancedVehiculosDto){
    try {
      const {page, rowsPerPage, filter, sortBy, order} = filterAdvancedVehiculosDto;
      const {
        easyFilter = '',
        assigned_to = '',
        regional = '',
        state = ''
      } = filter;
      const data= await this.mssqlEntityManager.query(`EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Hans_Vehiculos_Get_Total]
         ${page},
         ${rowsPerPage},
        '${sortBy}',
        '${order}',
        '${cleanSpecialCharacters(easyFilter,)}',
        '${regional}',
        '${state ?? ''}',
        '${assigned_to}'`);
      return data[0].total;
    } catch (error) {
      console.log(error);
    }
  }
}
