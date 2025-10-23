import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hanrt_territorios_hanrt_zonas_c')
export class HanrtTerritoriosZonasEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'hanrt_territorios_hanrt_zonashanrt_territorios_ida', length: 100 })
  hanrt_territorios_hanrt_zonashanrt_territorios_ida: string;

  @Column('nvarchar', { name: 'hanrt_territorios_hanrt_zonashanrt_zonas_idb', length: 100 })
  hanrt_territorios_hanrt_zonashanrt_zonas_idb: string;
  
}
