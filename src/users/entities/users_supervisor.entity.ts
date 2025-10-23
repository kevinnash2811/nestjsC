import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class UsersSupervisor {
  @PrimaryColumn()
  id: string;

  @Column('varchar', { name: 'user_name' })
  user_name: string;

  @Column('varchar', { name: 'first_name' })
  first_name: string;

  @Column('varchar', { name: 'last_name' })
  last_name: string;

  @Column('varchar', { name: 'photo' })
  photo: string;

  @Column('varchar', { name: 'reports_to_id' })
  reports_to_id: string;

  @Column('varchar', { name: 'iddivision_c' })
  iddivision_c: string;

  @Column('varchar', { name: 'iddivision_c_label' })
  iddivision_c_label: string;

  @Column('varchar', { name: 'idregional_c' })
  idregional_c: string;

  @Column('varchar', { name: 'idregional_c_label' })
  idregional_c_label: string;

  @Column('varchar', { name: 'idamercado_c' })
  idamercado_c: string;

  @Column('varchar', { name: 'idamercado_c_label' })
  idamercado_c_label: string;

  @Column('varchar', { name: 'rol_hbm_c' })
  rol_hbm_c: string;

  @Column('varchar', { name: 'easyFilter' })
  easyFilter: string;


}