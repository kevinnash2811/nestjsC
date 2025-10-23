import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ContactFilterDto } from '../dto';
import { ContactWithAccountsRaw } from '../interface';
import { processAdvancedFilter } from '../helpers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactsRepository {
  SQL_DATABASE: string;
  SQL_SCHEMA: string;

  constructor(
    @InjectEntityManager('DBCRM')
    private readonly dbEntityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {
    this.SQL_DATABASE = this.configService.get('SQL_DATABASE');
    this.SQL_SCHEMA = this.configService.get('SQL_SCHEMA');
  }
  /**
   * Retorna los registros de acuerdo al filtro
   * @param filters Filtros para el listado
   */
  async listFilters(
    filters: ContactFilterDto,
  ): Promise<ContactWithAccountsRaw[]> {
    const { strParams, params } = processAdvancedFilter(filters);
    try {
      const index = params.push(Number(filters.includeContactIds ?? 0));
      const includeIds = filters.contactIds ? filters.contactIds.join(',') : '';
      let contactIds = '';
      if (includeIds !== '') {
        const idxIds = params.push(includeIds)
        contactIds = `, @contactIds = @${idxIds - 1}`;
      }
      const sql = `EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA
        }].[contacts_accounts] ${strParams}, @includeContactIds = @${index - 1} ${contactIds};`;
      const data = await this.dbEntityManager.query(sql, params);
      if (data)
        return data;
    } catch (error) {
      console.error(error);
    }
    return Promise.resolve([]);
  }

  /**
   * Retorna la cantidad total de registros encontrados a partir de los filtros
   * @param filters Filtros para el listado
   */
  async totalListFilters(filters: ContactFilterDto): Promise<number> {
    const { strParams, params } = processAdvancedFilter(filters, true);
    // return 0;
    try {
      const index = params.push(Number(filters.includeContactIds ?? 0));
      const includeIds = filters.contactIds ? filters.contactIds.join(',') : '';
      let contactIds = '';
      if (includeIds !== '') {
        const idxIds = params.push(includeIds)
        contactIds = `, @contactIds = @${idxIds - 1}`;
      }
      const data = await this.dbEntityManager.query(
        `EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA
        }].[contacts_accounts_total] ${strParams}, @includeContactIds = @${index - 1} ${contactIds};`,
        params,
      );
      return data[0].totalRecords || 0;
    } catch (error) {
      console.error(error);
    }
    return 0;
  }
}
