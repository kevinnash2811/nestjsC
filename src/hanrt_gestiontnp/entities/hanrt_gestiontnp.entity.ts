import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hanrt_gestiontnp')
export class HanrtGestionTnpEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column('nvarchar', { name: 'name', length: 255 })
  name: string;

  @Column('datetime', { name: 'date_entered' })
  date_entered: Date;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('varchar', { name: 'modified_user_id', length: 255 })
  modified_user_id: string;

  @Column('varchar', { name: 'created_by', length: 255 })
  created_by: string;

  @Column('varchar', { name: 'description', length: 255 })
  description?: string;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'assigned_user_id', length: 255 })
  assigned_user_id: string;

  @Column('datetime', { name: 'fecha_inicio_c' })
  fecha_inicio_c: Date;

  @Column('datetime', { name: 'fecha_fin_c' })
  fecha_fin_c: Date;

  @Column('varchar', { name: 'estado_c', length: 255 })
  estado_c: string;

  @Column('varchar', { name: 'tipo_c', length: 255 })
  tipo_c: string;

  @Column('varchar', { name: 'sub_tipo_c', length: 255 })
  sub_tipo_c: string;

  @Column('nvarchar', { name: 'users_list_c', length: 100 })
  users_list_c: string;
}
