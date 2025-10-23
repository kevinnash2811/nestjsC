import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class Hanrt_ConductorGetService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
  ) {}

  async getHanrtConductorData(){
    const query = `
    SELECT
    hc.id AS id_conductor,
    hv.id AS id_vehiculo,
    hc.name AS alias_conductor,
    hc.iddivision_c AS iddivision_c,
    hc.idamercado_c AS idamercado_c,
    hl1.Value AS division,
    hl2.Value AS amercado,
    CASE 
        WHEN u.photo IS NOT NULL 
        THEN CONCAT('/upload/users/', u.id) 
        ELSE '/upload/users/avatardefault.png' 
    END AS avatar,
    hc.region_c AS regional,
    u.id AS id_user,
    LTRIM(CONCAT(u.first_name, ' ', u.last_name)) AS name_conductor
    FROM 
        hanrt_conductor hc
        LEFT JOIN users u ON u.id = hc.assigned_user_id
        LEFT JOIN hanrt_conductor_hans_vehiculos_c hchvc ON hchvc.hanrt_conductor_hans_vehiculoshanrt_conductor_idb = hc.id
        LEFT JOIN hans_vehiculos hv ON hv.id = hchvc.hanrt_conductor_hans_vehiculoshans_vehiculos_ida
        LEFT JOIN pro.hansacrm_list hl1 ON hl1.ListId = 'hansa_divisiones_list' 
            AND hl1.ID = hc.iddivision_c
        LEFT JOIN pro.hansacrm_list hl2 ON hl2.ListId = 'hansa_amercado_list' 
            AND hl2.ID = hc.idamercado_c
    WHERE 
        u.deleted = 0 
        AND hc.deleted = 0;
    `;

    const data = await this.mssqlEntityManager.query(query);
    const groupByUser = data.reduce((acc, item) => {
      if(acc[item.id_user]){
        acc[item.id_user].assigned_to.push(item.id_vehiculo);
        return acc;
      }
      
      acc[item.id_user] = {
        ...item,
        assigned_to: [item.id_vehiculo]
      }

      return acc;
    }, {})

    return Object.values(groupByUser);
  }
}
