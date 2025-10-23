import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { cleanSpecialCharacters } from '../../helpers';
import { FilterUsersDto } from '../dto';
import { ConfigService } from '@nestjs/config';
import { users } from '../SQL';

@Injectable()
export class UsersPostService {
  SQL_DATABASE: string;
  SQL_SCHEMA: string;

  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {
    this.SQL_DATABASE = this.configService.get('SQL_DATABASE');
    this.SQL_SCHEMA = this.configService.get('SQL_SCHEMA');
  }

  async listUsers(filterAdvancedDto: FilterUsersDto) {
    try {
      const { page, rowsPerPage, filter, sortBy, order } = filterAdvancedDto;
      const {
        easyFilter = '',
        reports_to_id = '',
        iddivision_c = '',
        idregional_c = '',
        idamercado_c = '',
      } = filter;

      const ids = await this.mssqlEntityManager.query<Array<{ id: string }>>(users.Get_Ids_Two_Levels, [reports_to_id]);
      const idsReportTo = ids.map((id: {id: string}) => `'${id.id}'`).join(',');

      const data = await this.mssqlEntityManager
        .query(`EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Users_Filter] 
      ${page},
      ${rowsPerPage},
      '${sortBy}',
      '${order}',
      '${cleanSpecialCharacters(easyFilter)}',
      '${cleanSpecialCharacters(idsReportTo)}',
      '${cleanSpecialCharacters(iddivision_c)}',
      '${cleanSpecialCharacters(idregional_c)}',
      '${cleanSpecialCharacters(idamercado_c)}'
`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async listUsersRol(filterAdvancedDto: FilterUsersDto) {
    try {
      const { page, rowsPerPage, filter, sortBy, order } = filterAdvancedDto;
      const {
        easyFilter = '',
        reports_to_id = '',
        iddivision_c = '',
        idregional_c = '',
        idamercado_c = '',
      } = filter;

      const data = await this.mssqlEntityManager
        .query(`EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Users_FilterRol] 
      ${page},
      ${rowsPerPage},
      '${sortBy}',
      '${order}',
      '${cleanSpecialCharacters(easyFilter)}',
      '${cleanSpecialCharacters(reports_to_id)}',
      '${cleanSpecialCharacters(iddivision_c)}',
      '${cleanSpecialCharacters(idregional_c)}',
      '${cleanSpecialCharacters(idamercado_c)}'
`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async listUsersTotal(filterAdvancedDto: FilterUsersDto) {
    try {
      //**DESFRAGMENTANDO DATA */
      const { filter } = filterAdvancedDto;
      const {
        easyFilter = '',
        reports_to_id = '',
        iddivision_c = '',
        idregional_c = '',
        idamercado_c = '',
      } = filter;

      const data = await this.mssqlEntityManager.query(`EXEC [${
        this.SQL_DATABASE
      }].[${this.SQL_SCHEMA}].[Users_Filter_Total] 
      '${cleanSpecialCharacters(easyFilter)}',
      '${cleanSpecialCharacters(reports_to_id)}',
      '${cleanSpecialCharacters(iddivision_c)}',
      '${cleanSpecialCharacters(idregional_c)}',
      '${cleanSpecialCharacters(idamercado_c)}'
`);
      return data[0].total;
    } catch (error) {
      console.log(error);
    }
  }
}
