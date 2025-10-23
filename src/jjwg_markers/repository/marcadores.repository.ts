import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HanrtMarkersEntity2, HanrtMarkersCstmEntity2, HanrtZonasMarkersEntity2} from '../entities';
import { CreateMarcadoresDTO, MarkerDto } from '../dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MarcadoresRepository {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

async createHanrtMarkers(
  createZonaDTO: CreateMarcadoresDTO,
  markers: MarkerDto[] 
): Promise<string[]> {
  const savedMarkersIds: string[] = [];

  await Promise.all(
    markers.map(async (marker) => {
      const markerId = uuidv4();
      
      const marcador = this.mssqlEntityManager.create(HanrtMarkersEntity2, {
        id: markerId,
        name: marker.name,
        date_entered: new Date(),
        date_modified: new Date(),
        modified_user_id: createZonaDTO.assigned_user_id,
        created_by: createZonaDTO.assigned_user_id,
        deleted: 0,
        assigned_user_id: createZonaDTO.assigned_user_id,
        jjwg_maps_lat: marker.jjwg_maps_lat,
        jjwg_maps_lng: marker.jjwg_maps_lng,
      });

      await this.mssqlEntityManager.save(HanrtMarkersEntity2, marcador);
      savedMarkersIds.push(markerId);
    })
  );

  return savedMarkersIds; // Retorna un array con los IDs de los marcadores creados
}

async createHanrtMarkersCstm(
  markersIds: string[], 
  markers: MarkerDto[]
): Promise<void> {
  await Promise.all(
    markers.map((marker, index) => {
      Logger.debug(marker);
      return this.mssqlEntityManager.save(HanrtMarkersCstmEntity2, {
        id_c: markersIds[index], 
        lat_anterior_c: `${marker.jjwg_maps_lat}`,
        lng_anterior_c: `${marker.jjwg_maps_lng}`,
        deleted_c: 0,
        secuencia_c: marker.secuencia_c || index + 1
      });
    })
  );
}

async createZonasMarcadores(idZona: string, idMarcadores: string[]) {
  // Crear relaciones para cada marcador
  const relaciones = await Promise.all(
    idMarcadores.map(idMarcador => {
      const relacion = this.mssqlEntityManager.create(HanrtZonasMarkersEntity2, {
        id: uuidv4(),
        date_modified: new Date(),
        deleted: 0,
        hanrt_zonas_jjwg_markershanrt_zonas_ida: idZona,
        hanrt_zonas_jjwg_markersjjwg_markers_idb: idMarcador,
      });
      return this.mssqlEntityManager.save(HanrtZonasMarkersEntity2, relacion);
    })
  );

  return relaciones;
}

async createMarcadorConRelacion(createMarcadoresDTO: CreateMarcadoresDTO) {

  let markersIds: string[] = [];
  if (createMarcadoresDTO.markers?.length > 0) {
    markersIds = await this.createHanrtMarkers(createMarcadoresDTO, createMarcadoresDTO.markers);
    await this.createHanrtMarkersCstm(
      markersIds, // 
      createMarcadoresDTO.markers
    );
  }


 await this.createZonasMarcadores(createMarcadoresDTO.idZona,markersIds);

  return {
    success: true,
    message: 'Marcadores y relaciones creadas exitosamente',
  };
}





}
