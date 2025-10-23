import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('jjwg_markers_cstm')
export class HanrtMarkersCstmEntity {
  @PrimaryColumn({name: 'id_c', type: 'varchar', length: 36 })
  id_c: string;

  @Column('nvarchar', { name: 'lat_anterior_c', length: 100 })
  lat_anterior_c: string;

  @Column('nvarchar', { name: 'lng_anterior_c', length: 100 })
  lng_anterior_c: string;

  @Column('bit', { name: 'deleted_c' })
  deleted_c: number;

  @Column('int', { name: 'secuencia_c'})
  secuencia_c: number; 
}
