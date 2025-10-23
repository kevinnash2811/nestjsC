import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_planificador_hans_vehiculos_c')
export class HanrtPlanificadorHansVehiculosEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('varchar', { name: 'hanrt_planificador_hans_vehiculoshanrt_planificador_ida', length: 255 })
  hanrt_planificador_hans_vehiculoshanrt_planificador_ida: string;

  @Column('varchar', { name: 'hanrt_planificador_hans_vehiculoshans_vehiculos_idb', length: 255 })
  hanrt_planificador_hans_vehiculoshans_vehiculos_idb: string;
}
