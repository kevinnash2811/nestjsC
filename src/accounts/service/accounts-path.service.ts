import { Injectable }             from '@nestjs/common';
import { InjectEntityManager }    from '@nestjs/typeorm';
import { EntityManager }          from 'typeorm';
import { AccountLatLng }          from '../dto';
import { AccountCustom }          from '../entities'

@Injectable()
export class AccountsPathService {

  constructor(
    @InjectEntityManager('DBCRM') private readonly mssqlEntityManager: EntityManager,
  ){}
  
  async updatelatLng(idAccount:string, accountLatLng:AccountLatLng): Promise<{ success: boolean, message: string, affected?: number }>{
    try {
      const { jjwg_maps_lat_c, jjwg_maps_lng_c } = accountLatLng;
      const result = await this.mssqlEntityManager.update(AccountCustom, { id_c: idAccount }, {
        jjwg_maps_lat_c,
        jjwg_maps_lng_c
      });
      if (result.affected === 0) {
        return { success: false, message: 'No rows were updated', affected: 0 };
      }
      return { success: true, message: 'Update executed successfully', affected: result.affected };
    } catch (error) {
      console.log(error);
    }
  }
}
