import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hanrt_frecuenciadetalle')
export class HanrtFrecuenciasDetalleEntity {
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
  deleted: boolean;

  @Column('nvarchar', { name: 'assigned_user_id', length: 255 })
  assigned_user_id: string;

  @Column('varchar', { name: 'valor_campo', length: 255 })
  valor_campo: string;

  @Column('bit', { name: 'habilitado_c' })
  habilitado_c: boolean;

  @Column('nvarchar', { name: 'tipo_periodo_c' })
  tipo_periodo_c: string;

  @Column('int', { name: 'valor_periodo_c' })
  valor_periodo_c: number;
}
