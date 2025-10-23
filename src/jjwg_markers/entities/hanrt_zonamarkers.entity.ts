import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hanrt_zonas_jjwg_markers_c')
export class HanrtZonasMarkersEntity2 {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'hanrt_zonas_jjwg_markershanrt_zonas_ida', length: 100 })
  hanrt_zonas_jjwg_markershanrt_zonas_ida: string;

  @Column('nvarchar', { name: 'hanrt_zonas_jjwg_markersjjwg_markers_idb', length: 100 })
  hanrt_zonas_jjwg_markersjjwg_markers_idb: string;
  
}
