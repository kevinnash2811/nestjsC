import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HanrtTerritoriosEntity } from '../entities';
import { CreateTerritorioDTO, TerritorioPatchDTO } from '../dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HanrtTerritoriosRepository {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

  async createHanrtTerritorios(createterritorioDTO: CreateTerritorioDTO) {
    const territorioId = uuidv4();

    const territorio = this.mssqlEntityManager.create(HanrtTerritoriosEntity, {
      id: territorioId,
      name: createterritorioDTO.name,
      date_entered: new Date(),
      date_modified: new Date(),
      modified_user_id: createterritorioDTO.assigned_user_id,
      created_by: createterritorioDTO.assigned_user_id,
      description: createterritorioDTO.description,
      deleted: 0,
      id_tenant: '',
      assigned_user_id: createterritorioDTO.assigned_user_id,
      iddivision_c: createterritorioDTO.iddivision_c,
      idamercado_c: createterritorioDTO.idamercado_c,
      idregional_c: createterritorioDTO.idregional_c,
      idcanal_c: createterritorioDTO.idcanal_c,
      tipo_c: createterritorioDTO.tipo_c,
      estado_c: createterritorioDTO.estado_c,
    });

    return await this.mssqlEntityManager.save(
      HanrtTerritoriosEntity,
      territorio,
    );
  }

  async updateHanrtTerritorios(
    id: string,
    patchDTO: Partial<TerritorioPatchDTO>,
  ) {
    const updatePayload: Partial<HanrtTerritoriosEntity> = {};

    const isValid = (value: any): boolean =>
      value !== undefined &&
      value !== null &&
      !(
        typeof value === 'string' &&
        (value.trim() === '' || value.trim().toLowerCase() === 'string')
      );

    for (const key in patchDTO) {
      const value = patchDTO[key];

      if (isValid(value)) {
        updatePayload[key] = value;
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return {
        message: 'No se encontraron campos válidos para actualizar.',
      };
    }

    updatePayload.date_modified = new Date();

    return await this.mssqlEntityManager.update(
      HanrtTerritoriosEntity,
      { id },
      updatePayload,
    );
  }
}
