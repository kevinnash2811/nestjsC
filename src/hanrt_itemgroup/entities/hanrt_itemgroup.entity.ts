import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_itemgroup')
export class HanrtItemGroupEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 }) // Asegúrate de que el ID tenga la longitud adecuada para UUID
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
  description: string;

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'id_tenant', length: 100 })
  id_tenant?: string;

  @Column('nvarchar', { name: 'assigned_user_id', length: 255 })
  assigned_user_id: string;

  @Column('datetime', { name: 'fecha_plan_c' })
  fecha_plan_c: Date;

  @Column('nvarchar', { name: 'capacidad_c', length: 255 })
  capacidad_c: string;

  @Column('datetime', { name: 'hora_inicio_c' })
  hora_inicio_c: Date;

  @Column('datetime', { name: 'duracion_c' })
  duracion_c: Date;

  @Column('datetime', { name: 'hora_fin_c' })
  hora_fin_c: Date;

  @Column('nvarchar', { name: 'secuencia_c', length: 255 })
  secuencia_c: string;

  @Column('nvarchar', { name: 'bloqueado_c', length: 100 })
  bloqueado_c: string;
}
