import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hanrt_ciclos_hanrt_planificador_c')
export class HanrtCiclosHanrtPlanificadorC {
  @PrimaryColumn({ type: 'nvarchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', {
    name: 'hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida',
    length: 36,
  })
  hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida: string;

  @Column('nvarchar', {
    name: 'hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb',
    length: 36,
  })
  hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb: string;
}
