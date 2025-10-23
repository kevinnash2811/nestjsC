import { AccountLatLng }          from '../dto';
export const accountsPath = {
    Path_Account_LatLng: (idAccount: string, accountLatLng:AccountLatLng) =>{
        const { jjwg_maps_lat_c, jjwg_maps_lng_c } = accountLatLng;
        return `
            UPDATE accounts_cstm
            SET jjwg_maps_lat_c ='${jjwg_maps_lat_c}', jjwg_maps_lng_c ='${jjwg_maps_lng_c}'
            WHERE id_c='${idAccount}';
        `
    }
}