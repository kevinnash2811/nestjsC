import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_planificador')
export class HanrtPlanificadorEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 }) // Asegúrate de que el ID tenga la longitud adecuada para UUID
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

  @Column('nvarchar', { name: 'id_tenant' })
  id_tenant?: string;

  @Column('nvarchar', { name: 'assigned_user_id', length: 255 })
  assigned_user_id: string;

  @Column('nvarchar', { name: 'tipo', length: 50 })
  tipo: string;

  @Column('nvarchar', { name: 'iddivision_c' })
  iddivision_c: string;

  @Column('nvarchar', { name: 'idamercado_c' })
  idamercado_c: string;

  @Column('nvarchar', { name: 'region_c' })
  region_c: string;

  @Column('nvarchar', { name: 'estado_planificacion_c' })
  estado_planificacion_c: string;

  @Column('datetime', { name: 'fecha_inicio_c' })
  fecha_inicio_c: Date;

  @Column('datetime', { name: 'fecha_fin_c' })
  fecha_fin_c: Date;

   @Column('varchar', { name: 'canal_c', length: 255 })
  canal_c: string;
    
  
}
