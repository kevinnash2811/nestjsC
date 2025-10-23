import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('hanrt_frecuencias')
export class HanrtFrecuenciasEntity {
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

  @Column('varchar', { name: 'module_c', length: 255 })
  module_c: string;

  @Column('varchar', { name: 'campo_c', length: 255 })
  campo_c: string;

  @Column('int', { name: 'cantidad_de_visitas_c' })
  cantidad_de_visita_c: number;

  @Column('nvarchar', { name: 'division_c' })
  division_c: string;

  @Column('nvarchar', { name: 'amercado_c' })
  amercado_c: string;

  @Column('nvarchar', { name: 'regional_c' })
  regional_c: string;
}