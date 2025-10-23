import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_planificador_hanrt_itemgroup_c')
export class HanrtPlanificadorHanrtItemgroupEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida', length: 36 })
  hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida: string;

  @Column('nvarchar', { name: 'hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb', length: 36 })
  hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb: string;
}
