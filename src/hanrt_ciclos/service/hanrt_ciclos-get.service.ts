import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HanrtCiclosEntity } from '../entities';
import { HansacrmList } from 'src/hansacrm_list/entities/hansacrm_list.entity';
import { GetCycleDTO } from '../dto/get-cycle.dto';

@Injectable()
export class HanrtCiclosGetService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

  async getCiclos(getCycleDTO: GetCycleDTO) {
    const { cod_usuario } = getCycleDTO;

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
      .addSelect('hl1.Value', 'iddivision_c_label')
      .addSelect('hl2.Value', 'idamercado_c_label')
      .addSelect('hl3.Value', 'region_c_label')
      .addSelect('hl4.Value', 'estado_c_label')
      .addSelect('hcu.hanrt_ciclos_usersusers_idb', 'user_id')
      .addSelect('u.user_name', 'cod_usuario')
      .leftJoin(
        'hanrt_ciclos_users_c',
        'hcu',
        'hcu.hanrt_ciclos_usershanrt_ciclos_ida = hc.id',
      )
      .leftJoin(
        'users',
        'u',
        'u.id = hcu.hanrt_ciclos_usersusers_idb',
      )
      .leftJoin(
        HansacrmList,
        'hl1',
        'hl1.ID = hc.iddivision_c AND hl1.ListId = :amercadoListId',
        {
          amercadoListId: 'hansa_divisiones_list',
        },
      )
      .leftJoin(
        HansacrmList,
        'hl2',
        'hl2.ID = hc.idamercado_c AND hl2.ListId = :divisionListId',
        {
          divisionListId: 'hansa_amercado_list',
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
      .where('hc.deleted = 0')
      .orderBy('hc.date_entered', 'ASC');

    // if (user_id) {
    //   query.andWhere('hcu.hanrt_ciclos_usersusers_idb = :user_id', { user_id });
    // }
    if (cod_usuario) {
      query.andWhere('u.user_name = :cod_usuario', { cod_usuario });
    }

    return query.getRawMany();
  }
}
