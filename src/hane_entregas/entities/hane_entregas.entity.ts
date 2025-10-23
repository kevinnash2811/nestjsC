import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hane_entregas')
export class HaneEntregas {
  @PrimaryColumn({ type: 'nvarchar', length: 36 })
  id: string;

  @Column('nvarchar', { name: 'name', length: 36 })
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
  description: string;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'assigned_user_id', length: 255 })
  assigned_user_id: string;

  @Column({ type: 'nvarchar' })
  estado_c: string;

  @Column({ type: 'nvarchar', length: 255 })
  parent_type: string;

  @Column({ type: 'nvarchar', length: 36 })
  parent_id: string;
}
