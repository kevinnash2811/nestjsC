export const item_ruta = {
  Get_Item_Ruta_By_Id_Planificador: (idplanificador: string) => `
        SELECT hi2.id
        FROM hanrt_planificador hp 
        INNER JOIN hanrt_planificador_hanrt_itemgroup_c hphic ON hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida = hp.id AND hphic.deleted ='0'
        INNER JOIN hanrt_itemgroup hi ON hi.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb AND hi.deleted ='0'
        INNER JOIN hanrt_itemgroup_hanrt_itemruta_c hihic ON hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida = hi.id AND hihic.deleted ='0'
        INNER JOIN hanrt_itemruta hi2 ON hi2.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb AND hi2.deleted ='0'
        WHERE hp.id='${idplanificador}' AND hp.deleted ='0'
    `,
  GetItemRutaByIdPlanificadorForToday: (idplanificador: string) => `
        SELECT hi2.id
        FROM hanrt_planificador hp 
        INNER JOIN hanrt_planificador_hanrt_itemgroup_c hphic ON hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida = hp.id AND hphic.deleted ='0'
        INNER JOIN hanrt_itemgroup hi ON hi.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb AND hi.deleted ='0'
        INNER JOIN hanrt_itemgroup_hanrt_itemruta_c hihic ON hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida = hi.id AND hihic.deleted ='0'
        INNER JOIN hanrt_itemruta hi2 ON hi2.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb AND hi2.deleted ='0'
        LEFT JOIN hana_visitas hv ON hv.id = hi2.id
        WHERE hp.id='${idplanificador}' AND hp.deleted ='0' AND hv.id IS NULL 
        AND CAST(hi2.fecha_inicio_c AS DATE) = CAST(GETDATE() AS DATE)
    `,
};