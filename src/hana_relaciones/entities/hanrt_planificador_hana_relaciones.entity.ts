import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_planificador_hana_relaciones_c')
export class HanrtPlanificadorHanaRelacionesEntity {
  @PrimaryColumn()
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: string;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('varchar', { name: 'hanrt_planificador_hana_relacioneshanrt_planificador_ida' })
  hanrt_planificador_hana_relacioneshanrt_planificador_ida: string;

  @Column('varchar', { name: 'hanrt_planificador_hana_relacioneshana_relaciones_idb' })
  hanrt_planificador_hana_relacioneshana_relaciones_idb: string;
}
