import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hanrt_ciclos_users_c')
export class HanrtCiclosUsersEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('varchar', {
    name: 'hanrt_ciclos_usershanrt_ciclos_ida',
    length: 255,
  })
  hanrt_ciclos_usershanrt_ciclos_ida: string;

  @Column('varchar', { name: 'hanrt_ciclos_usersusers_idb', length: 255 })
  hanrt_ciclos_usersusers_idb: string;
}
