import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('hansacrm_list', { schema: 'pro' })
export class HansacrmList {
  @PrimaryColumn('nvarchar', { name: 'ID', length: 255 })
  id: string;

  @Column('nvarchar', { name: 'Value', length: 255 })
  value: string;

  @Column('nvarchar', { name: 'ListId', length: 255 })
  listId: string;

  @Column('nvarchar', { name: 'ListType', length: 255 })
  listType: string;
}
