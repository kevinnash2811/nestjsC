import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ZonaPatchDTO, MarkerDtoPatch } from '../dto';
import { HanrtZonasRepository } from '../repository/hanrt_zonas.repository';

@Injectable()
export class ZonaPatchService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly hanrtZonasRepository: HanrtZonasRepository,
  ) {}

  async updateZona(
    idZona: string,
    territorio: ZonaPatchDTO,
  ): Promise<{ success: boolean; message: string; affected?: number }> {
    try {
      const existingZona = await this.mssqlEntityManager.query(
        `SELECT * FROM hanrt_zonas WHERE id = @0`,
        [idZona],
      );

      if (existingZona.length === 0) {
        return { success: false, message: 'Zona no encontrado' };
      }

      const isValid = (value: any): boolean =>
        value !== undefined &&
        value !== null &&
        !(
          typeof value === 'string' &&
          (value.trim() === '' || value.trim().toLowerCase() === 'string')
        );

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
        { field: 'background_color', value: territorio.background_color },
        { field: 'border_color', value: territorio.border_color },
        { field: 'border_width', value: territorio.border_width },
        { field: 'layer_level', value: territorio.layer_level },
        { field: 'background_opacity', value: territorio.background_opacity },
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
        return {
          success: false,
          message: 'No hay campos válidos para actualizar',
        };
      }

      // Agregamos el ID como última variable para el WHERE
      values.push(idZona);

      const query = `
        UPDATE hanrt_zonas
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

  async updateMarcador(
    idMarcador: string,
    marcadorData: MarkerDtoPatch,
  ): Promise<{ success: boolean; message: string; affected?: number }> {
    try {
      const existingMarcador = await this.mssqlEntityManager.query(
        `SELECT * FROM jjwg_markers WHERE id = @0`,
        [idMarcador],
      );

      if (existingMarcador.length === 0) {
        return { success: false, message: 'Marcador no encontrado' };
      }

      const fieldsToUpdate: string[] = [];
      const values: Array<string | Date | number> = [];

      const updatableFields = [
        { field: 'name', value: marcadorData.name },
        { field: 'jjwg_maps_lat', value: marcadorData.jjwg_maps_lat },
        { field: 'jjwg_maps_lng', value: marcadorData.jjwg_maps_lng },
        { field: 'date_modified', value: new Date() },
      ];

      // Preparar campos y valores para la actualización
      updatableFields.forEach(({ field, value }) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== '0' &&
          !(
            typeof value === 'string' &&
            (value.trim() === '' || value.trim().toLowerCase() === 'string')
          )
        ) {
          fieldsToUpdate.push(`${field} = @${values.length}`);
          values.push(value);
        }
      });

      if (fieldsToUpdate.length === 0) {
        return {
          success: false,
          message: 'No hay campos válidos para actualizar',
        };
      }

      values.push(idMarcador);

      const query = `
      UPDATE jjwg_markers
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = @${values.length - 1}
    `;

      const result = await this.mssqlEntityManager.query(query, values);

      if (
        marcadorData.jjwg_maps_lat !== '0' &&
        marcadorData.jjwg_maps_lng !== '0' &&
        marcadorData.secuencia_c !== 0
      ) {
        await this.mssqlEntityManager.query(
          `
        UPDATE jjwg_markers_cstm
        SET lat_anterior_c = @0, lng_anterior_c = @1,secuencia_c = @2
        WHERE id_c = @3
      `,
          [
            marcadorData.jjwg_maps_lat,
            marcadorData.jjwg_maps_lng,
            marcadorData.secuencia_c,
            idMarcador,
          ],
        );
      }

      return {
        success: true,
        message: 'Marcador actualizado con éxito',
        affected: result?.affectedRows || 0,
      };
    } catch (error) {
      console.error('Error al actualizar marcador:', error);
      return {
        success: false,
        message: `Error al actualizar el marcador: ${error.message}`,
      };
    }
  }

  async updateZonaConRelacion(
    idZona: string,
    zonaData: ZonaPatchDTO,
  ): Promise<{
    success: boolean;
    message: string;
    idZona: string;
    updatedMarkers?: string[];
  }> {
    try {
      const updateZonaResult = await this.updateZona(idZona, zonaData);
      if (!updateZonaResult.success) {
        return {
          success: false,
          message: updateZonaResult.message,
          idZona,
        };
      }

      await this.hanrtZonasRepository.clearMarkers(idZona);

      const markersIds = await this.hanrtZonasRepository.createHanrtMarkers(
        { assigned_user_id: zonaData.modified_user_id },
        zonaData.markers,
      );
      await this.hanrtZonasRepository.createHanrtMarkersCstm(markersIds);
      await this.hanrtZonasRepository.createZonasMarcadores(idZona, markersIds);

      return {
        success: true,
        message: 'Actualización de Zona y marcadores ejecutada exitosamente',
        idZona,
      };
    } catch (error) {
      console.error('Error en updateZonaConRelacion:', error);
      return {
        success: false,
        message: `Error al actualizar zona y marcadores: ${error.message}`,
        idZona,
      };
    }
  }
}
