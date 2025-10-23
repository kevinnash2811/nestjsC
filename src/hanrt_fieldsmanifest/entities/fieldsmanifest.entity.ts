import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('fieldsmanifest')
export class FieldsManifest {
  @PrimaryColumn()
  id: string;

  @Column('varchar', { name: 'module_c' })
  module_c: string;

  @Column('varchar', { name: 'field_meta_data_id_c' })
  field_meta_data_id_c: string;

  @Column('varchar', { name: 'is_exportable_c' })
  is_exportable_c: string;

  @Column('varchar', { name: 'is_integrable_c' })
  is_integrable_c: string;

  @Column('varchar', { name: 'is_editable_c' })
  is_editable_c: string;

  @Column('varchar', { name: 'is_importable_c' })
  is_importable_c: string;
}