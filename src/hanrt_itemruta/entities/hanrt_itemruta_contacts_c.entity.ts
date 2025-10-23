import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_itemruta_contacts_c')
export class HanrtItemrutaContactsEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 }) // Asegúrate de que el ID tenga la longitud adecuada para UUID
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;

  @Column('bit', { name: 'deleted' })
  deleted: Number;

  @Column('nvarchar', { name: 'hanrt_itemruta_contactscontacts_ida' })
  hanrt_itemruta_contactscontacts_ida: string;

  @Column('nvarchar', { name: 'hanrt_itemruta_contactshanrt_itemruta_idb' })
  hanrt_itemruta_contactshanrt_itemruta_idb: string;
}
