import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_itemgroup_hans_vehiculos_c')
export class HanrtItemgroupHansVehiculosEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;
  
  @Column('bit', { name: 'deleted' })
  deleted: Number;
  
  @Column('nvarchar', { name: 'hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida', length: 36 })
  hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida: string;

  @Column('nvarchar', { name: 'hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb', length: 36 })
  hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb: string;
  
}
