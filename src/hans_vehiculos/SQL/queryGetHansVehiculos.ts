export const hans_vehiculos = { 
    Get_Hans_Vehiculos_Data:(plate:string) =>`
        SELECT hv.id AS id_vehiculo, hv.name AS name_vehiculo, hv.capacidad_1_c AS capacidad 
        FROM hans_vehiculos hv WITH (NOLOCK)
        WHERE hv.name = '${plate}'
    `,
    Get_Hans_Vehiculos_Drivers:(idHansVehiculo:string) =>`
        SELECT hc.id AS id_conductor, hc.name AS name_conductor, hl.value AS tipo_conductor, CONCAT(u.first_name, ' ',u.last_name) AS name_user
        FROM hanrt_conductor_hans_vehiculos_c hchvc WITH (NOLOCK)
        INNER JOIN hanrt_conductor hc WITH (NOLOCK) ON hchvc.hanrt_conductor_hans_vehiculoshanrt_conductor_idb = hc.id AND hc.deleted = 0
        INNER JOIN users u WITH (NOLOCK) ON hc.assigned_user_id = u.id AND u.deleted = 0
        INNER JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hc.tipo_c AND hl.ListId ='hansa_tipo_conductor_list'
        WHERE hchvc.hanrt_conductor_hans_vehiculoshans_vehiculos_ida = '${idHansVehiculo}' AND hchvc.deleted = 0
        ORDER BY hc.tipo_c
    `,
};