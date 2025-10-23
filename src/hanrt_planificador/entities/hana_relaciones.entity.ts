import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('han_relaciones')
export class HanaRelacionesEntity {
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
  description: string; 

  @Column('bit', { name: 'deleted' })
  deleted: number;

  @Column('nvarchar', { name: 'assigned_user_id', length: 255 })
  assigned_user_id: string;

  @Column('nvarchar', { name: 'tipo_relacion', length: 100 })
  tipo_relacion: string;

  @Column('nvarchar', { name: 'principal', length: 100 })
  principal: string;

  @Column('nvarchar', { name: 'iddivision_c', length: 100 })
  iddivision_c: string;

  @Column('nvarchar', { name: 'idamercado_c', length: 100 })
  idamercado_c: string;

  @Column('nvarchar', { name: 'idgrupocliente_c', length: 100 })
  idgrupocliente_c: string;

  @Column('nvarchar', { name: 'idsector_c', length: 100 })
  idsector_c: string;
  
  @Column('nvarchar', { name: 'idregional_c', length: 100 })
  idregional_c: string;

  @Column('nvarchar', { name: 'idcanalvta_c', length: 100 })
  idcanalvta_c: string;

  @Column('nvarchar', { name: 'id_tenant', length: 100 })
  id_tenant: string;
}
