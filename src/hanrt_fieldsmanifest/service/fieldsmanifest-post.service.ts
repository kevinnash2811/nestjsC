import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { cleanSpecialCharacters } from '../../helpers';
import { FilterFieldsManifestDto } from '../dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FieldsManifestPostService {
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

  async listFieldsManifest(filterAdvancedDto: FilterFieldsManifestDto) {
    try {
      //**DESFRAGMENTANDO DATA */
      const { page, rowsPerPage, filter, sortBy, order } = filterAdvancedDto;
      const { 
        module_c = '',
        is_importable_c = ''
      } = filter;

      const data = await this.mssqlEntityManager.query(`EXEC [${
        this.SQL_DATABASE
      }].[${this.SQL_SCHEMA}].[FieldsManifest] 
      ${page},
      ${rowsPerPage},
      '${sortBy}',
      '${order}',
      '${cleanSpecialCharacters(module_c)}',
      '${cleanSpecialCharacters(is_importable_c)}'
`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

}