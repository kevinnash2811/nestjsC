import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HanrtFrecuenciasCreateDTO } from '../dto/hanrt_frecuencias-create.dto';
import { HanrtFrecuenciasEntity } from '../entities/hanrt_frecuencias.entity';
import { v4 as uuidv4 } from 'uuid';
import { HanrtFrecuenciasListDTO } from '../dto/hanrt_frecuencias-list.dto';
import { HanrtFrecuenciasDetalleEntity } from 'src/hanrt_frecuenciasdetalle/entities/hanrt_frecuenciasdetalle.entity';
import { HanrtFrecuenciasHanrtFrecuenciaDetalleEntity } from '../entities/hanrt_frecuencias_hanrt_frecuenciadetalle_c';
import { HanrtFrecuenciasPaginateDTO } from '../dto/hanrt_frecuencias-paginate.dto';
import { HansacrmList } from 'src/hansacrm_list/entities/hansacrm_list.entity';

@Injectable()
export class HanrtFrecuenciasRepository {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly entityManager: EntityManager,
  ) {}

  async createFrecuenciaTransaction(
    transactionalEntityManager: EntityManager,
    {
      amercado,
      campo,
      cantidadDeVisitas,
      division,
      modulo,
      nombre,
      regional,
      userId,
      frecuenciaDetalles,
    }: HanrtFrecuenciasCreateDTO,
  ) {
    try {
      const results = [];
      const frecuenciaId = uuidv4();
      const result = await transactionalEntityManager.insert(
        HanrtFrecuenciasEntity,
        {
          id: frecuenciaId,
          name: nombre,
          module_c: modulo,
          campo_c: campo,
          cantidad_de_visita_c: cantidadDeVisitas,
          division_c: division,
          amercado_c: amercado,
          regional_c: regional,
          deleted: false,
          date_entered: new Date(),
          date_modified: new Date(),
          modified_user_id: userId,
          created_by: userId,
          assigned_user_id: userId,
          description: '',
        },
      );

      for (const detalle of frecuenciaDetalles) {
        results.push(result);
        const detalleId = uuidv4();
        const frecuenciaDetalle = await transactionalEntityManager.insert(
          HanrtFrecuenciasDetalleEntity,
          {
            id: detalleId,
            name: nombre,
            valor_campo: detalle.valorCampo,
            habilitado_c: detalle.habilitado,
            tipo_periodo_c: detalle.tipoPeriodo,
            valor_periodo_c: detalle.valorPeriodo,
            deleted: false,
            date_entered: new Date(),
            date_modified: new Date(),
            modified_user_id: userId,
            created_by: userId,
            assigned_user_id: userId,
          },
        );

        const relation = await transactionalEntityManager.insert(
          HanrtFrecuenciasHanrtFrecuenciaDetalleEntity,
          {
            id: uuidv4(),
            hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuencias_ida:
              frecuenciaId,
            hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuenciadetalle_idb:
              detalleId,
            deleted: false,
            date_modified: new Date(),
          },
        );

        results.push(frecuenciaDetalle, relation);
      }

      return results;
    } catch (e) {
      Logger.error(e);
    }
  }

  create(hanrtFrecuenciasCreateDTO: HanrtFrecuenciasCreateDTO) {
    return this.entityManager.transaction((t: EntityManager) =>
      this.createFrecuenciaTransaction(t, hanrtFrecuenciasCreateDTO),
    );
  }

  async list({ amercado, division, regional }: HanrtFrecuenciasListDTO) {
    return this.entityManager.find(HanrtFrecuenciasEntity, {
      where: {
        amercado_c: amercado.length ? amercado : null,
        division_c: division.length ? division : null,
        regional_c: regional.length ? regional : null,
      },
      select: ['id', 'name'],
    });
  }

  async getAll({
    amercado,
    division,
    regional,
    limit,
    page,
  }: HanrtFrecuenciasPaginateDTO) {
    return this.entityManager
      .createQueryBuilder(HanrtFrecuenciasEntity, 'hf')
      .select([
        'hf.id AS id',
        'hf.name AS name',
        'hf.module_c AS module',
        'hf.campo_c AS campo',
        'hf.cantidad_de_visita_c AS cantidad_de_visita',
        'hf.division_c AS division',
        'hf.amercado_c AS amercado',
        'hf.regional_c AS regional',
        'hl1.Value AS division_label',
        'hl2.Value AS amercado_label',
        'hl3.Value AS regional_label',
        'hl4.Value AS module_label',
        'hf.date_entered AS date_entered',
      ])
      .where('hf.amercado_c = :amercado', { amercado })
      .andWhere('hf.division_c = :division', { division })
      .andWhere('hf.regional_c = :regional', { regional })
      .andWhere('hf.deleted = 0')
      .leftJoin(
        HansacrmList,
        'hl1',
        'hl1.ID = hf.division_c AND hl1.ListId = :divisionListId',
        { divisionListId: 'hansa_divisiones_list' },
      )
      .leftJoin(
        HansacrmList,
        'hl2',
        'hl2.ID = hf.amercado_c AND hl2.ListId = :amercadoListId',
        { amercadoListId: 'hansa_amercado_list' },
      )
      .leftJoin(
        HansacrmList,
        'hl3',
        'hl3.ID = hf.regional_c AND hl3.ListId = :regionalListId',
        { regionalListId: 'hansa_dimregional_list' },
      )
      .leftJoin(
        HansacrmList,
        'hl4',
        'hl4.ID = hf.module_c AND hl4.ListId = :moduleListId',
        { moduleListId: 'moduleList' },
      )
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany();
  }

  async countAll({
    amercado,
    division,
    regional,
    limit,
    page,
  }: HanrtFrecuenciasPaginateDTO) {
    return this.entityManager.count(HanrtFrecuenciasEntity, {
      where: {
        amercado_c: amercado,
        division_c: division,
        regional_c: regional,
        deleted: false,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }
}
