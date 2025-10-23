import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_itemruta')
export class HanrtItemrutaEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 }) // Asegúrate de que el ID tenga la longitud adecuada para UUID
  id: string;

  @Column('nvarchar', { name: 'name', length: 255 })
  name: string;

  @Column('datetime', { name: 'date_entered' })
  date_entered: Date;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;
  
  @Column('varchar', { name: 'modified_user_id', length: 36 })
  modified_user_id: string;

  @Column('varchar', { name: 'created_by', length: 36 })
  created_by: string;

  @Column('varchar', { name: 'description' })
  description: string;
  
  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'id_tenant', length: 255 })
  id_tenant?: string;
 
  @Column('varchar', { name: 'assigned_user_id', length: 36 })
  assigned_user_id: string;

  @Column('nvarchar', { name: 'tipo_visita_c', length: 100 })
  tipo_visita_c: string;

  @Column('nvarchar', {name: 'tipo_visita_hbm_c', length: 100})
  tipo_visita_hbm_c: string;

  @Column('datetime', { name: 'fecha_inicio_c' })
  fecha_inicio_c: Date;
 
  @Column('datetime', { name: 'hora_inicio_c' })
  hora_inicio_c: Date;

  @Column('datetime', { name: 'duracion_c' })
  duracion_c: Date;

  @Column('datetime', { name: 'fecha_fin_c' })
  fecha_fin_c: Date;

  @Column('datetime', { name: 'hora_fin_c' })
  hora_fin_c: Date;

  @Column('varchar', { name: 'evento_dia' })
  evento_dia?: string;

  @Column('int', { name: 'secuencia_c' })
  secuencia_c: number;
 
  @Column('nvarchar', { name: 'jjwg_maps_lat_c', length: 255 })
  jjwg_maps_lat_c: string;
 
  @Column('nvarchar', { name: 'jjwg_maps_lng_c', length: 255 })
  jjwg_maps_lng_c: string;

  @Column('nvarchar', { name: 'parent_type', length: 255 })
  parent_type?: string;

  @Column('varchar', { name: 'parent_id', length: 36 })
  parent_id?: string;
}
