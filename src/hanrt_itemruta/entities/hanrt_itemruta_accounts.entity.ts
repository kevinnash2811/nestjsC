import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_itemruta_accounts_c')
export class HanrtItemrutaAccountsEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 }) // Asegúrate de que el ID tenga la longitud adecuada para UUID
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;
  
  @Column('bit', { name: 'deleted' })
  deleted: Number;
  
  @Column('nvarchar', { name: 'hanrt_itemruta_accountsaccounts_ida' })
  hanrt_itemruta_accountsaccounts_ida: string;

  @Column('nvarchar', { name: 'hanrt_itemruta_accountshanrt_itemruta_idb' })
  hanrt_itemruta_accountshanrt_itemruta_idb: string;
  
}
