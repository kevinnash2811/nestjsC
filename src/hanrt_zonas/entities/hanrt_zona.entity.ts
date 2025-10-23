import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hanrt_zonas')
export class HanrtZonasEntity {
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

  @Column('varchar', { name: 'id_tenant', length: 255 })
  id_tenant?: string;

  @Column('nvarchar', { name: 'assigned_user_id', length: 255 })
  assigned_user_id: string;

  @Column('nvarchar', { name: 'iddivision_c', length: 100 })
  iddivision_c: string;

  @Column('nvarchar', { name: 'idamercado_c', length: 100 })
  idamercado_c: string;

  @Column('nvarchar', { name: 'idregional_c', length: 100 })
  idregional_c: string;

  @Column('nvarchar', { name: 'idcanal_c', length: 100 })
  idcanal_c: string;

  @Column('nvarchar', { name: 'tipo_c', length: 100 })
  tipo_c: string;

  @Column('nvarchar', { name: 'estado_c', length: 100 })
  estado_c: string;

  @Column('nvarchar', { name: 'background_color', length: 100 })
  background_color: string;

  @Column('nvarchar', { name: 'border_color', length: 100 })
  border_color: string;

  @Column('nvarchar', { name: 'border_width', length: 100 })
  border_width: string;

  @Column('nvarchar', { name: 'layer_level', length: 100 })
  layer_level: string;

  @Column('nvarchar', { name: 'background_opacity', length: 100 })
  background_opacity: string;

  @Column('nvarchar', { name: 'zona_c', length: 100 })
  zona_c: string;
}
