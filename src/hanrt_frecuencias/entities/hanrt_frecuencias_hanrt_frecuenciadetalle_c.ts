import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('hanrt_frecuencias_hanrt_frecuenciadetalle_c')
export class HanrtFrecuenciasHanrtFrecuenciaDetalleEntity {
  @PrimaryColumn({ type: 'varchar', length: 45 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: boolean;

  @Column('varchar', {
    name: 'hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuencias_ida',
    length: 255,
  })
  hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuencias_ida: string;

  @Column('varchar', {
    name: 'hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuenciadetalle_idb',
    length: 255,
  })
  hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuenciadetalle_idb: string;
}
