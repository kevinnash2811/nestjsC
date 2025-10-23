import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_itemgroup_hanrt_itemruta_c')
export class HanrtItemgroupHanrtItemrutaEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;
  
  @Column('bit', { name: 'deleted' })
  deleted: Number;
  
  @Column('nvarchar', { name: 'hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida', length: 36 })
  hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida: string;

  @Column('nvarchar', { name: 'hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb', length: 36 })
  hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb: string;
  
}
