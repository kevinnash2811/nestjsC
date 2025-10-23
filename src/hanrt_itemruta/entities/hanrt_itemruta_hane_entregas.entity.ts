import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_itemruta_hane_entregas_c')
export class HanrtItemrutaHaneEntregasEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 }) // Asegúrate de que el ID tenga la longitud adecuada para UUID
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;
  
  @Column('bit', { name: 'deleted' })
  deleted: Number;
  
  @Column('nvarchar', { name: 'hanrt_itemruta_hane_entregashanrt_itemruta_ida', length: 36 })
  hanrt_itemruta_hane_entregashanrt_itemruta_ida: string;

  @Column('nvarchar', { name: 'hanrt_itemruta_hane_entregashane_entregas_idb', length: 36 })
  hanrt_itemruta_hane_entregashane_entregas_idb: string;
  
}
