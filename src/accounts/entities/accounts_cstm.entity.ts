import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('accounts_cstm')
export class AccountCustom {
  @PrimaryColumn()
  id_c: string;

  @Column('real', { name: 'jjwg_maps_lat_c' })
  jjwg_maps_lat_c: number;

  @Column('real', { name: 'jjwg_maps_lng_c' })
  jjwg_maps_lng_c: number;
}