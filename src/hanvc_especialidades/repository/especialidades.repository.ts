import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class EspecialidadesRepository {
  SQL_DATABASE: string;

  constructor(
    @InjectEntityManager('DBCRM')
    private readonly dbEntityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {
    this.SQL_DATABASE = this.configService.get('SQL_DATABASE');
  }

  getAll() {
    try {
      const sql = `SELECT * FROM [${this.SQL_DATABASE}].[dbo].[hanvc_especialidades];`;
      return this.dbEntityManager.query(sql, []);
    } catch (error) {
      console.error(error);
    }
    return Promise.resolve([]);
  }
}
