import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TerritorioPatchDTO } from '../dto';
import { HanrtTerritoriosRepository } from '../repository/hanrt_territorios.repository';

@Injectable()
export class TerritorioPatchService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly territorioRepository: HanrtTerritoriosRepository,
  ) {}

  async updateTerritorio(
    idTerritorio: string,
    territorio: TerritorioPatchDTO,
  ): Promise<{ success: boolean; message: string; affected?: number }> {
    try {
      const existingTerritorio = await this.mssqlEntityManager.query(
        `SELECT * FROM hanrt_territorios WHERE id = @0`,
        [idTerritorio],
      );

      if (existingTerritorio.length === 0) {
        return { success: false, message: 'Territorio no encontrado' };
      }

      const isValid = (value: any): boolean =>
        value !== undefined &&
        value !== null &&
        !(typeof value === 'string' && (value.trim() === '' || value.trim().toLowerCase() === 'string'));

      const fieldsToUpdate: string[] = [];
      const values: Array<string | Date> = [];

      const updatableFields = [
        { field: 'name', value: territorio.name },
        { field: 'description', value: territorio.description },
        { field: 'iddivision_c', value: territorio.iddivision_c },
        { field: 'idamercado_c', value: territorio.idamercado_c },
        { field: 'idregional_c', value: territorio.idregional_c },
        { field: 'idcanal_c', value: territorio.idcanal_c },
        { field: 'tipo_c', value: territorio.tipo_c },
        { field: 'estado_c', value: territorio.estado_c },
        { field: 'modified_user_id', value: territorio.modified_user_id },
      ];

      updatableFields.forEach(({ field, value }) => {
        if (isValid(value)) {
          fieldsToUpdate.push(`${field} = @${values.length}`);
          values.push(value);
        }
      });

      // Siempre actualizamos la fecha de modificación
      const now = new Date();
      fieldsToUpdate.push(`date_modified = @${values.length}`);
      values.push(now);

      if (fieldsToUpdate.length === 0) {
        return { success: false, message: 'No hay campos válidos para actualizar' };
      }

      // Agregamos el ID como última variable para el WHERE
      values.push(idTerritorio);

      const query = `
        UPDATE hanrt_territorios
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = @${values.length - 1}
      `;

      const result = await this.mssqlEntityManager.query(query, values);

      return {
        success: true,
        message: 'Actualización ejecutada con éxito',
        affected: result?.affectedRows || 1, // o 0 si no se actualizó nada
      };
    } catch (error) {
      console.error('Error al actualizar territorio:', error);

      return {
        success: false,
        message: `Error al actualizar el territorio: ${error.message}`,
      };
    }
  }
}
