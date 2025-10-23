import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hanrt_ciclos_hanrt_frecuencias_c')
export class HanrtCiclosHanrtFrecuenciasEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('varchar', {
    name: 'hanrt_ciclos_hanrt_frecuenciashanrt_frecuencias_ida',
    length: 255,
  })
  hanrt_ciclos_hanrt_frecuenciashanrt_frecuencias_ida: string;

  @Column('varchar', {
    name: 'hanrt_ciclos_hanrt_frecuenciashanrt_ciclos_idb',
    length: 255,
  })
  hanrt_ciclos_hanrt_frecuenciashanrt_ciclos_idb: string;
}
