import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HanrtZonasEntity, HanrtTerritoriosZonasEntity, HanrtMarkersEntity, HanrtMarkersCstmEntity, HanrtZonasMarkersEntity} from '../entities';
import { CreateZonaDTO, ZonaPatchDTO, MarkerDto } from '../dto';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

@Injectable()
export class HanrtZonasRepository {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

  async clearMarkers(idZona: string): Promise<void> {
    await this.mssqlEntityManager.query(
      `DELETE FROM jjwg_markers WHERE id IN (SELECT hanrt_zonas_jjwg_markersjjwg_markers_idb FROM hanrt_zonas_jjwg_markers_c WHERE hanrt_zonas_jjwg_markershanrt_zonas_ida = @0)`,
      [idZona],
    );
    await this.mssqlEntityManager.query(
      `DELETE FROM hanrt_zonas_jjwg_markers_c WHERE hanrt_zonas_jjwg_markershanrt_zonas_ida = @0`,
      [idZona],
    );
  }

  async createHanrtZonas(createZonaDTO: CreateZonaDTO): Promise<string> {
    const zonaId = uuidv4();

    const existingTerritorios = await this.mssqlEntityManager.query(
      `SELECT * FROM hanrt_territorios WHERE id = @0`,
      [createZonaDTO.idTerritorio],
    );

    const existingTerritorio = existingTerritorios[0];

    if (!existingTerritorio) {
      throw new Error('Territorio no encontrado');
    }

    const zona = this.mssqlEntityManager.create(HanrtZonasEntity, {
      id: zonaId,
      name: createZonaDTO.name,
      date_entered: new Date(),
      date_modified: new Date(),
      modified_user_id: createZonaDTO.assigned_user_id,
      created_by: createZonaDTO.assigned_user_id,
      description: createZonaDTO.description,
      deleted: 0,
      id_tenant: '',
      assigned_user_id: createZonaDTO.assigned_user_id,

      iddivision_c: existingTerritorio.iddivision_c,
      idamercado_c: existingTerritorio.idamercado_c,
      idregional_c: existingTerritorio.idregional_c,
      idcanal_c: existingTerritorio.idcanal_c,
      tipo_c: existingTerritorio.tipo_c,

      estado_c: createZonaDTO.estado_c,
      background_color: createZonaDTO.background_color,
      border_color: createZonaDTO.border_color,
      border_width: createZonaDTO.border_width,
      layer_level: createZonaDTO.layer_level,
      zona_c: createZonaDTO.zonaDistribucion,
      background_opacity: createZonaDTO.background_opacity,
    });

    await this.mssqlEntityManager.save(HanrtZonasEntity, zona);

    return zonaId;
  }

  async createHanrtTerritoriosZonas(idTerritorio: string, zonaId: string) {
    const territoriozonaId = uuidv4();

    const territoriozona = this.mssqlEntityManager.create(
      HanrtTerritoriosZonasEntity,
      {
        id: territoriozonaId,
        date_modified: new Date(),
        deleted: 0,
        hanrt_territorios_hanrt_zonashanrt_territorios_ida: idTerritorio,
        hanrt_territorios_hanrt_zonashanrt_zonas_idb: zonaId,
      },
    );

    return await this.mssqlEntityManager.save(
      HanrtTerritoriosZonasEntity,
      territoriozona,
    );
  }

  async createHanrtMarkers(
    createZonaDTO: Pick<CreateZonaDTO, 'assigned_user_id'>,
    markers: MarkerDto[],
  ): Promise<Record<string, MarkerDto>> {
    const savedMarkersIds: Record<string, MarkerDto> = {};

    await Promise.all(
      markers.map(async (marker) => {
        const markerId = uuidv4();

        const marcador = this.mssqlEntityManager.create(HanrtMarkersEntity, {
          id: markerId,
          name: marker.name,
          date_entered: new Date(),
          date_modified: new Date(),
          modified_user_id: createZonaDTO.assigned_user_id,
          created_by: createZonaDTO.assigned_user_id,
          deleted: 0,
          assigned_user_id: createZonaDTO.assigned_user_id,
          jjwg_maps_lat: `${marker.jjwg_maps_lat}`,
          jjwg_maps_lng: `${marker.jjwg_maps_lng}`,
        });

        await this.mssqlEntityManager.save(HanrtMarkersEntity, marcador);
        savedMarkersIds[markerId] = marker;
      }),
    );

    return savedMarkersIds; // Retorna un array con los IDs de los marcadores creados
  }

  async createHanrtMarkersCstm(
    markersIds: Record<string, MarkerDto>,
  ): Promise<void> {
    await Promise.all(
      Object.entries(markersIds).map(([key, value], index) => {
        return this.mssqlEntityManager.save(HanrtMarkersCstmEntity, {
          id_c: key,
          lat_anterior_c: `${value.jjwg_maps_lat}`,
          lng_anterior_c: `${value.jjwg_maps_lng}`,
          deleted_c: 0,
          secuencia_c: value.secuencia_c || index + 1,
        });
      }),
    );
  }

  async createZonasMarcadores(
    idZona: string,
    idMarcadores: Record<string, MarkerDto>,
  ) {
    const relaciones = await Promise.all(
      Object.keys(idMarcadores).map((idMarcador) => {
        const relacion = this.mssqlEntityManager.create(
          HanrtZonasMarkersEntity,
          {
            id: uuidv4(),
            date_modified: new Date(),
            deleted: 0,
            hanrt_zonas_jjwg_markershanrt_zonas_ida: idZona,
            hanrt_zonas_jjwg_markersjjwg_markers_idb: idMarcador,
          },
        );
        return this.mssqlEntityManager.save(HanrtZonasMarkersEntity, relacion);
      }),
    );

    return relaciones;
  }
  async createZonaConRelacion(createZonaDTO: CreateZonaDTO) {
    // 1. Crear la zona principal
    const zonaId = await this.createHanrtZonas(createZonaDTO);

    // 2. Crear la relación con el territorio
    await this.createHanrtTerritoriosZonas(createZonaDTO.idTerritorio, zonaId);

    // 3. Procesar los marcadores si existen
    let markersIds: Record<string, MarkerDto> = {};
    if (createZonaDTO.markers?.length > 0) {
      markersIds = await this.createHanrtMarkers(
        createZonaDTO,
        createZonaDTO.markers,
      );
      await this.createHanrtMarkersCstm(markersIds);
    }

    // 4. Crear la relación entre la zona y los marcadores
    await this.createZonasMarcadores(zonaId, markersIds);

    return {
      success: true,
      message:
        'Zona, relación con territorio y marcadores creados exitosamente',
      zonaId,
      markersIds,
    };
  }

  async updateHanrtTerritorios(id: string, patchDTO: Partial<ZonaPatchDTO>) {
    const updatePayload: Partial<HanrtZonasEntity> = {};

    const isValid = (value: any): boolean =>
      value !== undefined &&
      value !== null &&
      !(
        typeof value === 'string' &&
        (value.trim() === '' || value.trim().toLowerCase() === 'string')
      );

    for (const key in patchDTO) {
      const value = patchDTO[key];

      if(key === 'zonaDistribucion') {
        updatePayload.zona_c = value;
        continue;
      }
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
      HanrtZonasEntity,
      { id },
      updatePayload,
    );
  }
}
