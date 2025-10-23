import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('jjwg_markers')
export class HanrtMarkersEntity2 {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column('nvarchar', { name: 'name', length: 100 })
  name: string;

  @Column('datetime', { name: 'date_entered' })
  date_entered: Date;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('nvarchar', { name: 'modified_user_id', length: 100 })
  modified_user_id: string;

  @Column('nvarchar', { name: 'created_by', length: 100 })
  created_by: string;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'assigned_user_id', length: 100 })
  assigned_user_id: string;

  @Column('nvarchar', { name: 'jjwg_maps_lat' })
  jjwg_maps_lat: string;

  @Column('nvarchar', { name: 'jjwg_maps_lng' })
  jjwg_maps_lng: string;
}
