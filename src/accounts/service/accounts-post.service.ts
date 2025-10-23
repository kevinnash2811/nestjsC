import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { cleanSpecialCharacters } from '../../helpers';
import { AccountWithContactsFilter, FilterAdvancedDto } from '../dto';
import { AccountRepository } from '../repository/account.repository';
import { AccountWithContactsRaw } from '../interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountsPostService {
  SQL_DATABASE: string;
  SQL_SCHEMA: string;

  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly accRepo: AccountRepository,
    private readonly configService: ConfigService,
  ) {
    this.SQL_DATABASE = this.configService.get('SQL_DATABASE');
    this.SQL_SCHEMA = this.configService.get('SQL_SCHEMA');
  }

  async listAccounts(filterAdvancedDto: FilterAdvancedDto) {
    try {
      //**DESFRAGMENTANDO DATA */
      const { page, rowsPerPage, filter, sortBy, order } = filterAdvancedDto;
      const {
        easyFilter = '',
        name = '',
        lastname = '',
        comercial_name = '',
        client_type = '',
        account_type = '',
        aio_code = '',
        nit_ci = '',
        cellphone = '',
        category = '',
        email = '',
        industry = '',
        sub_industry = '',
        country = '',
        state = '',
        city = '',
        street = '',
        document_type = '',
        tax_regime = '',
        website = '',
        created_by = '',
        modified_by = '',
        assigned_to = '',
        creation_date = {
          option: '',
          from: '',
          to: '',
          operator: '',
        },
        latlng,
        zona_venta_c = '',
        category2 = '',
        exclude = '',
        customerGroup = '',
        includes = '',
        planificacion = '',
        ruleDate = '',
      } = filter;
      const { from, to, operator } = creation_date;
      const idsToInclude = Array.isArray(filter.idsToInclude) ? filter.idsToInclude.join(',') : '';
      const idsToExclude = Array.isArray(filter.idsToExclude) ? filter.idsToExclude.join(',') : '';
      const query = `EXEC [${
        this.SQL_DATABASE
      }].[${this.SQL_SCHEMA}].[Accounts_Filter_Advanced] 
      ${page},
      ${rowsPerPage},
      '${sortBy}',
      '${order}',
      '${cleanSpecialCharacters(easyFilter)}',
      '${cleanSpecialCharacters(name)}',
      '${cleanSpecialCharacters(lastname)}',
      '${cleanSpecialCharacters(comercial_name)}',
      '${client_type}',
      '${account_type}',
      '${cleanSpecialCharacters(aio_code)}',
      '${cleanSpecialCharacters(nit_ci)}',
      '${cleanSpecialCharacters(cellphone)}',
      '${category}',
      '${cleanSpecialCharacters(email)}',
      '${industry}',
      '${sub_industry}',
      '${country}',
      '${state}',
      '${cleanSpecialCharacters(city)}',
      '${cleanSpecialCharacters(street)}',
      '${document_type}',
      '${tax_regime}',
      '${website}',
      '${created_by}',
      '${modified_by}',
      '${assigned_to}',
      '${from}',
      '${to}',
      '${operator}',
      '${latlng}',
      '${zona_venta_c}',
      '${category2}',
      '',
      '${exclude}',
      '${customerGroup}',
      '${planificacion}',
      '${includes}',
      '${ruleDate}',
      '${idsToInclude}',
      '${idsToExclude}'`;

      const data = await this.mssqlEntityManager.query(query);
      return data.map((e) => ({ ...e, tareas: JSON.parse(e.tareas_json ?? "[]") }));
    } catch (error) {
      console.log(error);
    }
  }

  async listTotalAccounts(filterAdvancedDto: FilterAdvancedDto) {
    try {
      //**DESFRAGMENTANDO DATA */
      const { page, rowsPerPage, filter, sortBy, order } = filterAdvancedDto;
      const {
        easyFilter = '',
        name = '',
        lastname = '',
        comercial_name = '',
        client_type = '',
        account_type = '',
        aio_code = '',
        nit_ci = '',
        cellphone = '',
        category = '',
        email = '',
        industry = '',
        sub_industry = '',
        country = '',
        state = '',
        city = '',
        street = '',
        document_type = '',
        tax_regime = '',
        website = '',
        created_by = '',
        modified_by = '',
        assigned_to = '',
        creation_date = {
          option: '',
          from: '',
          to: '',
          operator: '',
        },
        latlng,
        zona_venta_c = '',
        category2 = '',
        exclude = '',
        customerGroup = '',
        includes = '',
        planificacion = '',
      } = filter;

      // if(Array.isArray(assigned_to) && assigned_to.length === 0) {
      //   return 0;
      // }

      const { from, to, operator } = creation_date;
      const data = await this.mssqlEntityManager
        .query(`EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Accounts_Get_Total] 
        '${easyFilter}',
        '${name}',
        '${lastname}',
        '${comercial_name}',
        '${client_type}',
        '${account_type}',
        '${aio_code}',
        '${nit_ci}',
        '${cellphone}',
        '${category}',
        '${email}',
        '${industry}',
        '${sub_industry}',
        '${country}',
        '${state}',
        '${city}',
        '${street}',
        '${document_type}',
        '${tax_regime}',
        '${website}',
        '${created_by}',
        '${modified_by}',
        '${assigned_to}',
        '${from}',
        '${to}',
        '${operator}',
        '${latlng}',
        '${zona_venta_c}',
        '${category2}',
        '${exclude}',
        '${customerGroup}',
        '${planificacion}',
        '${includes}'`);
      return data[0].total;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @param filters filtros avanzados 
   * @returns array de cuentas con sus contactos 
   */
  async filterListWithContacts(filters: AccountWithContactsFilter){
    const data = await this.accRepo.filterListWithContacts(filters);
    return data.map((a: AccountWithContactsRaw) => ({...a, contacts: JSON.parse(a.contacts ?? '[]'), tasks: JSON.parse(a.tareas_json ?? '[]')}));
  }
  totalRecordsListWithContacts(filters: AccountWithContactsFilter){
    return this.accRepo.filterListWithContactsTotal(filters);
  }
}
