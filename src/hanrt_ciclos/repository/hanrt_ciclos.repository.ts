import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { HansacrmList } from 'src/hansacrm_list/entities/hansacrm_list.entity';
import { EntityManager } from 'typeorm';
import { HanrtCiclosEntity } from '../entities';
import { CreateCycleDTO } from '../dto';
import { v4 as uuidv4 } from 'uuid';
import { HanrtCiclosHanrtFrecuenciasEntity } from '../entities/hanrt_ciclos_hanrt_frecuencias_c';
import { HanrtCiclosUsersEntity } from '../entities/hanrt_ciclos_users_c';

@Injectable()
export class HanrtCiclosRepository {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

  getHanrtCiclos() {
    const query = this.mssqlEntityManager
      .createQueryBuilder(HanrtCiclosEntity, 'hc')
      .select('hc.id', 'id')
      .addSelect('hc.name', 'ciclo_name')
      .addSelect(
        'DATEADD(HOUR, -4, hc.fecha_inicio_hora_c)',
        'ciclo_fecha_inicio_hora_c',
      )
      .addSelect(
        'DATEADD(HOUR, -4, hc.fecha_fin_hora_c)',
        'ciclo_fecha_fin_hora_c',
      )
      .addSelect('hc.cantidad_visitas_dia_c', 'ciclo_cantidad_visitas_dia_c')
      .addSelect('hc.dias_c', 'ciclo_dias_c')
      .addSelect('hc.horas_por_dia_c', 'ciclo_horas_por_dia_c')
      .addSelect('hc.estado_c', 'ciclo_estado_c')
      .addSelect('hc.region_c', 'ciclo_region_c')
      .addSelect('hc.iddivision_c', 'ciclo_iddivision_c')
      .addSelect('hc.idamercado_c', 'ciclo_idamercado_c')
      .addSelect("ISNULL(hl1.Value, 'Todas')", 'iddivision_c_label')
      .addSelect("ISNULL(hl2.Value, 'Todas')", 'idamercado_c_label')
      .addSelect("ISNULL(hl3.Value, 'Todas')", 'region_c_label')
      .addSelect('hl4.Value', 'estado_c_label')
      .addSelect(
        `ISNULL((SELECT
          hf2.valor_campo, 
          ISNULL(hf2.cantidad_visitas_c, 0) AS cantidad_visitas_c 
        FROM hanrt_frecuenciadetalle hf2
        LEFT JOIN hanrt_frecuencias_hanrt_frecuenciadetalle_c hfhf
        ON hf2.id = hfhf.hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuenciadetalle_idb
        WHERE hfhf.hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuencias_ida = hf.id
        ORDER BY hf2.valor_campo ASC
        FOR JSON PATH
        ), '[]')`,
        'frecuencia',
      )
      .leftJoin(
        HansacrmList,
        'hl1',
        'hl1.ID = hc.iddivision_c AND hl1.ListId = :divisionListId',
        {
          divisionListId: 'hansa_divisiones_list',
        },
      )
      .leftJoin(
        HansacrmList,
        'hl2',
        'hl2.ID = hc.idamercado_c AND hl2.ListId = :amercadoListId',
        {
          amercadoListId: 'hansa_amercado_list',
        },
      )
      .leftJoin(
        HansacrmList,
        'hl3',
        'hl3.ID = hc.region_c AND hl3.ListId = :regionListId',
        {
          regionListId: 'hansa_dimregional_list',
        },
      )
      .leftJoin(
        HansacrmList,
        'hl4',
        'hl4.ID = hc.estado_c AND hl4.ListId = :estadoListId',
        {
          estadoListId: 'estado_ciclo_c',
        },
      )
      .leftJoin(
        'hanrt_ciclos_hanrt_frecuencias_c',
        'hchf',
        'hc.id = hchf.hanrt_ciclos_hanrt_frecuenciashanrt_ciclos_idb',
      )
      .leftJoin(
        'hanrt_frecuencias',
        'hf',
        'hf.id = hchf.hanrt_ciclos_hanrt_frecuenciashanrt_frecuencias_ida',
      )
      .where('hc.deleted = 0')
      .orderBy('hc.date_entered', 'ASC');

    return query.getRawMany();
  }

  async createHanrtCiclos(createcycleDTO: CreateCycleDTO) {
    const cycleId = uuidv4();
    const response = await this.mssqlEntityManager.insert(HanrtCiclosEntity, {
      id: cycleId,
      name: createcycleDTO.name,
      fecha_inicio_hora_c: new Date(
        new Date(createcycleDTO.dateOfInit).setHours(
          new Date(createcycleDTO.dateOfInit).getHours() + 4,
        ),
      ),
      fecha_fin_hora_c: new Date(
        new Date(createcycleDTO.dateOfEnd).setHours(
          new Date(createcycleDTO.dateOfEnd).getHours() + 4,
        ),
      ),
      dias_c: createcycleDTO.days.toString(),
      cantidad_visitas_dia_c: createcycleDTO.visitPerDay.toString(),
      horas_por_dia_c: createcycleDTO.hourPerDay.toString(),
      region_c: createcycleDTO.region,
      deleted: 0,
      assigned_user_id: createcycleDTO.userId,
      date_entered: new Date(new Date().setHours(new Date().getHours() + 4)),
      date_modified: new Date(new Date().setHours(new Date().getHours() + 4)),
      description: createcycleDTO.description,
      estado_c: createcycleDTO.state,
      idamercado_c: createcycleDTO.idamercado,
      iddivision_c: createcycleDTO.iddivision,
      modified_user_id: createcycleDTO.userId,
      created_by: createcycleDTO.userId,
    });

    const promises = createcycleDTO.users.map((user) =>
      this.createRelationHanrtCiclosUser(user, cycleId),
    );

    await this.createRelationHanrtCiclosFrecuencias(
      createcycleDTO.frequencyId,
      cycleId,
    );

    await Promise.all(promises);

    return response;
  }

  async createRelationHanrtCiclosUser(userId: string, cycleId: string) {
    return this.mssqlEntityManager.insert(HanrtCiclosUsersEntity, {
      id: uuidv4(),
      date_modified: new Date(new Date().setHours(new Date().getHours() + 4)),
      deleted: 0,
      hanrt_ciclos_usershanrt_ciclos_ida: cycleId,
      hanrt_ciclos_usersusers_idb: userId,
    });
  }

  async createRelationHanrtCiclosFrecuencias(
    frequencyId: string,
    cycleId: string,
  ) {
    return this.mssqlEntityManager.insert(HanrtCiclosHanrtFrecuenciasEntity, {
      id: uuidv4(),
      date_modified: new Date(new Date().setHours(new Date().getHours() + 4)),
      deleted: 0,
      hanrt_ciclos_hanrt_frecuenciashanrt_frecuencias_ida: frequencyId,
      hanrt_ciclos_hanrt_frecuenciashanrt_ciclos_idb: cycleId,
    });
  }
}
