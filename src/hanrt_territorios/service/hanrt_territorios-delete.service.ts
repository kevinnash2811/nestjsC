import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HanrtTerritoriosRepository } from '../repository/hanrt_territorios.repository';

@Injectable()
export class HanrtTerritoriosDeleteService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly territorioRepository: HanrtTerritoriosRepository,
  ) {}

  async deleteTerritorio(
    idTerritorio: string,
  ): Promise<{ success: boolean; message: string; affected?: number }> {
    try {
      const existingTerritorio = await this.mssqlEntityManager.query(
        `SELECT * FROM hanrt_territorios WHERE id = @0`,
        [idTerritorio],
      );

      if (!existingTerritorio || existingTerritorio.length === 0) {
        return { success: false, message: 'Territorio no encontrado' };
      }

      const updateQuery = `
        UPDATE hanrt_territorios
        SET deleted = 1
        WHERE id = @0
      `;

      await this.mssqlEntityManager.query(updateQuery, [idTerritorio]);

      return {
        success: true,
        message: 'Territorio eliminado correctamente',
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
