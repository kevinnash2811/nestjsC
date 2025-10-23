import { Injectable, Logger } from '@nestjs/common';
import { CreateTerritorioDTO, FilterAdvancedTerritoriosDto } from '../dto';
import { HanrtTerritoriosRepository } from '../repository/hanrt_territorios.repository';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { cleanSpecialCharacters } from 'src/helpers';

@Injectable()
export class HanrtTerritoriosPostService {
  SQL_DATABASE: string;
  SQL_SCHEMA: string;
  HANSACRM3: string;
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly hanrtTerritoriosRepository: HanrtTerritoriosRepository,
  ) {
    this.SQL_DATABASE = this.configService.get('SQL_DATABASE');
    this.SQL_SCHEMA = this.configService.get('SQL_SCHEMA');
    this.HANSACRM3 = this.configService.get('HANSACRM3');
  }

  async createHanrtTerritorios(createterritorioDTO: CreateTerritorioDTO) {
    return this.hanrtTerritoriosRepository.createHanrtTerritorios(
      createterritorioDTO,
    );
  }

  async listTerritoriosByFilter(
    filterAdvancedDto: FilterAdvancedTerritoriosDto,
  ) {
    try {
      const {
        page,
        rowsPerPage,
        filter: {
          easyFilter = '',
          assigned_to = '',
          modified_to = '',
          created_to = '',
          name = '',
          description = '',
          tipo = '',
          iddivisionC = '',
          idamercadoC = '',
          regionC = '',
          canalC = '',
          estado = '',
          fechaInicioC = '',
          fechaFinC = '',
        },
      } = filterAdvancedDto;

      const data = await this.mssqlEntityManager.query(`EXEC [${
        this.SQL_DATABASE
      }].[${this.SQL_SCHEMA}].[Territorios_Filter] 
          ${page},
          ${rowsPerPage},
          '${cleanSpecialCharacters(easyFilter)}',
          '${assigned_to}',
          '${modified_to}',
          '${created_to}',
          '${name}',
          '${description}',
          '${tipo}',
          '${iddivisionC}',
          '${idamercadoC}',
          '${regionC}',
          '${canalC}',
          '${estado}',
          '${fechaInicioC}',
          '${fechaFinC}'`);

      const total = await this.mssqlEntityManager.query(`EXEC [${
        this.SQL_DATABASE
      }].[${this.SQL_SCHEMA}].[Territorios_Get_Total] 
          '${cleanSpecialCharacters(easyFilter)}',
          '${assigned_to}',
          '${modified_to}',
          '${created_to}',
          '${name}',
          '${description}',
          '${tipo}',
          '${iddivisionC}',
          '${idamercadoC}',
          '${regionC}',
          '${canalC}',
          '${estado}',
          '${fechaInicioC}',
          '${fechaFinC}'`);

      console.log(total);

      return {
        data: data,
        total: total[0].total,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
