import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('hanrt_itemruta_hanrt_tareasplan_c')
export class HanrtItemrutaHanrtTareasPlanEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 36 }) // Asegúrate de que el ID tenga la longitud adecuada para UUID
  id: string;

  @Column('datetime', { name: 'date_modified' })
  date_modified: Date;
  
  @Column('bit', { name: 'deleted' })
  deleted: Number;
  
  @Column('nvarchar', { name: 'hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida', length: 36 })
  hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida: string;

  @Column('nvarchar', { name: 'hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb', length: 36 })
  hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb: string;
  
}
