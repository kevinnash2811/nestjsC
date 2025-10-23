import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { Account } from "../interface";
import { InjectEntityManager } from "@nestjs/typeorm";
import { AccountWithContactsFilter, OrderByOptions, OrderDirection } from "../dto";
import { cleanSpecialCharacters } from "src/helpers";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AccountRepository{
  SQL_DATABASE: string;
  SQL_SCHEMA: string;

  constructor(@InjectEntityManager('DBCRM') private readonly dbEntityManager: EntityManager, private readonly configService: ConfigService){
    this.SQL_DATABASE = this.configService.get('SQL_DATABASE');
    this.SQL_SCHEMA = this.configService.get('SQL_SCHEMA');
  }

  findAccountContacts(accountId: string): Promise<[]>{
    const sql = `SELECT c.id, c.date_entered, c.deleted, c.description, c.salutation, c.first_name, c.last_name, c.title, c.photo, c.phone_mobile, c.portal_user_type FROM contacts c INNER JOIN accounts_contacts ac ON c.id = ac.contact_id AND ac.account_id = @0 WHERE c.deleted = 0;`;

    return this.dbEntityManager.query(sql, [accountId]);
  }
  findContactAccounts(contactId: string): Promise<Account[]>{
    const sql = `SELECT a.id, a.name, a.date_entered, a.deleted, a.account_type, a.phone_office, a.shipping_address_street, a.shipping_address_city FROM accounts a INNER JOIN accounts_contacts ac ON a.id = ac.account_id AND ac.contact_id = @0 WHERE a.deleted = 0;`;

    return this.dbEntityManager.query(sql, [contactId]);
  }
  filterListWithContacts(filters: AccountWithContactsFilter){
    const {
      search = '',
      page = 1,
      pageSize = 15,
      sortBy = OrderByOptions.NAME,
      order = OrderDirection.ASC,
      advanced
    } = filters;
    const {
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
      latlng = '',
      zona_venta_c = '',
      category2 = '',
      exclude = '',
      customerGroup = '',
      includes = '',
      planificacion = '',
    } = advanced ?? {};
    try {
      const params = [page, pageSize, sortBy, order, search];
      const sql = `EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[accounts_list_with_contacts_advanced] 
            ${page},
            ${pageSize},
            '${sortBy}',
            '${order}',
            '${cleanSpecialCharacters(search ?? '')}',
            '${cleanSpecialCharacters(name ?? '')}',
            '${cleanSpecialCharacters(lastname ?? '')}',
            '${cleanSpecialCharacters(comercial_name ?? '')}',
            '${client_type}',
            '${account_type}',
            '${cleanSpecialCharacters(aio_code ?? '')}',
            '${cleanSpecialCharacters(nit_ci ?? '')}',
            '${cleanSpecialCharacters(cellphone ?? '')}',
            '${category}',
            '${cleanSpecialCharacters(email ?? '')}',
            '${industry}',
            '${sub_industry}',
            '${country ?? ''}',
            '${state ?? ''}',
            '${cleanSpecialCharacters(city ?? '')}',
            '${cleanSpecialCharacters(street ?? '')}',
            '${document_type}',
            '${tax_regime}',
            '${website}',
            '${created_by}',
            '${modified_by}',
            '${assigned_to}',
            '${creation_date.from}',
            '${creation_date.to}',
            '${creation_date.operator}',
            '${latlng}',
            '${zona_venta_c}',
            '${category2}',
            '${exclude}',
            '${customerGroup}',
            '${planificacion}',
            '${includes}'`;
      console.log(sql);
      return this.dbEntityManager.query(sql, params);
    } catch (error) {
      console.log(error);
    }
    return Promise.resolve([]);
  }


  filterListWithContactsTotal(filters: AccountWithContactsFilter){
    const {
      search = '',
      advanced
    } = filters;
    const {
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
      latlng = '',
      zona_venta_c = '',
      category2 = '',
      exclude = '',
      customerGroup = '',
      includes = '',
      planificacion = '',
    } = advanced ?? {};
    try {
      const params = [search];
      const sql = `EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[accounts_list_with_contacts_total] 
        '${search}',
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
        '${country ?? ''}',
        '${state ?? ''}',
        '${city ?? ''}',
        '${street}',
        '${document_type}',
        '${tax_regime}',
        '${website}',
        '${created_by}',
        '${modified_by}',
        '${assigned_to}',
        '${creation_date.from}',
        '${creation_date.to}',
        '${creation_date.operator}',
        '${latlng}',
        '${zona_venta_c}',
        '${category2}',
        '${exclude}',
        '${customerGroup}',
        '${planificacion}',
        '${includes}'`;

      return this.dbEntityManager.query(sql, params);
    } catch (error) {
      console.log(error)
    }
    return Promise.resolve([]);
  }
}