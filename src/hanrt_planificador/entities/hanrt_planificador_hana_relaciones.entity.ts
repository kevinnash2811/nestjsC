import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_planificador_hana_relaciones_c')
export class HanrtPlanificadorHanaRelacionesEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'hanrt_planificador_hana_relacioneshanrt_planificador_ida', length: 36 })
  hanrt_planificador_hana_relacioneshanrt_planificador_ida: string;

  @Column('nvarchar', { name: 'hanrt_planificador_hana_relacioneshana_relaciones_idb', length: 36 })
  hanrt_planificador_hana_relacioneshana_relaciones_idb: string;
}
