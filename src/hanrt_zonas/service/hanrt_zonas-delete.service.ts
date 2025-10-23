import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HanrtZonasRepository } from '../repository/hanrt_zonas.repository';

@Injectable()
export class HanrtZonasDeleteService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly zonaRepository: HanrtZonasRepository,
  ) {}

  async deleteZona(
    idZona: string,
  ): Promise<{ success: boolean; message: string; affected?: number }> {
    try {
      const existingZona = await this.mssqlEntityManager.query(
        `SELECT * FROM hanrt_zonas WHERE id = @0`,
        [idZona],
      );

      if (!existingZona || existingZona.length === 0) {
        return { success: false, message: 'Zona no encontrado' };
      }

      const updateQuery = `
        UPDATE hanrt_zonas
        SET deleted = 1
        WHERE id = @0
      `;

      await this.mssqlEntityManager.query(updateQuery, [idZona]);

      return {
        success: true,
        message: 'Zona eliminado correctamente',
        affected: 1,
      };
    } catch (error) {
      console.error('Error al eliminar territorio:', error);

      return {
        success: false,
        message: `Error al eliminar el territorio: ${error.message}`,
      };
    }
  }
}
