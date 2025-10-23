import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class HanrtTerritoriosGetService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

  async getTerritorio(territorioId: string) {
    try {
      const zonas = await this.mssqlEntityManager.query(
        `
        SELECT 
          hz.*, 
          ht.id as idTerritorio
        FROM 
          hanrt_zonas hz
        JOIN 
          hanrt_territorios_hanrt_zonas_c hthzc 
          ON hthzc.hanrt_territorios_hanrt_zonashanrt_zonas_idb = hz.id
        JOIN 
          hanrt_territorios ht 
          ON ht.id = hthzc.hanrt_territorios_hanrt_zonashanrt_territorios_ida
        WHERE 
          hz.deleted = 0 
          AND ht.deleted = 0
          AND ht.id = @0
        `,
        [territorioId],
      );
      const zonasFormateadas = []
      for (const zona of zonas) {
        const markers = await this.mssqlEntityManager.query(`
              SELECT
                jm.jjwg_maps_lat,
                jm.jjwg_maps_lng,
                jmc.secuencia_c
              FROM 
                jjwg_markers jm 
              JOIN 
                hanrt_zonas_jjwg_markers_c hzjmc 
                ON hzjmc.hanrt_zonas_jjwg_markersjjwg_markers_idb = jm.id
                AND hzjmc.hanrt_zonas_jjwg_markershanrt_zonas_ida = @0
              LEFT JOIN jjwg_markers_cstm jmc 
                ON jm.id = jmc.id_c
              WHERE 
                jm.deleted = 0
              ORDER BY 
                jmc.secuencia_c ASC
          `, [zona.id]);
  
        zonasFormateadas.push({
          ...zona, 
          markers
        })
      }

      return zonasFormateadas;
    } catch (error) {
      console.error('Error en getTerritorio:', error);
      throw error;
    }
  }

  private parseAndFormatMarkers(markersJson: string): any[] {
    try {
      const markers = JSON.parse(markersJson);

      return markers.map((marker) => ({
        jjwg_maps_lat: marker.jjwg_maps_lat,
        jjwg_maps_lng: marker.jjwg_maps_lng,
      }));
    } catch (error) {
      console.error('Error al parsear markers:', error);
      return [];
    }
  }
}
