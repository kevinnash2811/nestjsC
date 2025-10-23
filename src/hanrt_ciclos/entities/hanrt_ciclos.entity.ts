import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hanrt_ciclos')
export class HanrtCiclosEntity {
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

  @Column('datetime', { name: 'fecha_inicio_hora_c' })
  fecha_inicio_hora_c: Date;

  @Column('datetime', { name: 'fecha_fin_hora_c' })
  fecha_fin_hora_c: Date;

  @Column('varchar', { name: 'cantidad_visitas_dia_c', length: 255 })
  cantidad_visitas_dia_c: string;

  @Column('varchar', { name: 'dias_c', length: 255 })
  dias_c: string;

  @Column('varchar', { name: 'horas_por_dia_c', length: 255 })
  horas_por_dia_c: string;

  @Column('nvarchar', { name: 'iddivision_c', length: 100 })
  iddivision_c: string;

  @Column('nvarchar', { name: 'idamercado_c', length: 100 })
  idamercado_c: string;

  @Column('nvarchar', { name: 'region_c', length: 100 })
  region_c: string;

  @Column('nvarchar', { name: 'estado_c', length: 100 })
  estado_c: string;
}
