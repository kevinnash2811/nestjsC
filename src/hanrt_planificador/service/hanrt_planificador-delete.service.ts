import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class HanrtPlanificadorDeleteService {
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

  async deletePlanificador(idPlanificador: string) {
    try {
      return this.mssqlEntityManager.query(
        `EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Delete_Planificacion] @planificacion_id = '${idPlanificador}'`,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
