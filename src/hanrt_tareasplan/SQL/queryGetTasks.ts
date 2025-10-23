export const tasks = {
  getList: (type: string) => `
    SELECT ht.id,
        ht.name,
        ht.description,
        ht.iddivision_c, hl.Value as division,
        ht.idamercado_c, hl1.Value as amercado,
        ht.region_c, hl2.Value as region,
        ht.tipo_tarea_c, hl3.Value as tipotarea,
        ht.estado_c, hl4.Value as estadotarea,
        ht.obligatorio_c,
        ht2.codigo
    FROM hanrt_tareasplan ht 
    INNER JOIN hanrt_tareasplan_hantt_tipostarea_c hthtc ON hthtc.hanrt_tareasplan_hantt_tipostareahanrt_tareasplan_idb = ht.id AND hthtc.deleted ='0'
    INNER JOIN hantt_tipostarea ht2 ON ht2.id = hthtc.hanrt_tareasplan_hantt_tipostareahantt_tipostarea_ida AND ht2.deleted ='0'
    LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = ht.iddivision_c AND hl.ListId = 'hansa_divisiones_list'
    LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = ht.idamercado_c  AND hl1.ListId = 'hansa_amercado_list'
    LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = ht.region_c  AND hl2.ListId = 'hansa_dimregion_list'
    LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = ht.tipo_tarea_c  AND hl3.ListId = 'tipo_tarea_c_list'
    LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = ht.estado_c  AND hl4.ListId = 'hansa_estado_tarea_list'
    WHERE ht.tipo_tarea_c ='${type}' AND ht.deleted ='0' AND ht.estado_c ='E01' AND ht.tarea_para_c = 'H01'
  `,
  getListTareasPlan: (
    type: string,
    tarea_para: string,
    fechaInicio: string,
    fechaFin: string,
  ) => `
    SELECT ht.id,
        ht.name,
        ht.description,
        ht.iddivision_c, hl.Value as division,
        ht.idamercado_c, hl1.Value as amercado,
        ht.region_c, hl2.Value as region,
        ht.tipo_tarea_c, hl3.Value as tipotarea,
        ht.estado_c, hl4.Value as estadotarea,
        ht.obligatorio_c,
        ht.tarea_para_c, hl5.Value as tarea_para,
        hr.fecha_inicio_c as fecha_inicio_regla,
        hr.fecha_fin_c as fecha_fin_regla,
        hr.id as idRegla
    FROM hanrt_tareasplan ht 
    LEFT JOIN hanrt_reglasenrutamiento_hanrt_tareasplan_c hrhtc
      ON hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_tareasplan_idb = ht.id AND hrhtc.deleted = 0
    LEFT JOIN hanrt_reglasenrutamiento hr
      ON hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_reglasenrutamiento_ida = hr.id AND hr.deleted = 0 
    LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = ht.iddivision_c AND hl.ListId = 'hansa_divisiones_list'
    LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = ht.idamercado_c  AND hl1.ListId = 'hansa_amercado_list'
    LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = ht.region_c  AND hl2.ListId = 'hansa_dimregion_list'
    LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = ht.tipo_tarea_c  AND hl3.ListId = 'tipo_tarea_c_list'
    LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = ht.estado_c  AND hl4.ListId = 'hansa_estado_tarea_list'
    LEFT JOIN pro.hansacrm_list hl5 WITH (NOLOCK) ON hl5.ID = ht.tarea_para_c  AND hl5.ListId = 'hansa_head_tarea_list'
    WHERE ht.tipo_tarea_c ='${type}' AND ht.deleted ='0' AND ht.estado_c ='E01' AND ht.tarea_para_c = '${tarea_para}'
    AND hr.estado_c = 'ER01'
    AND hr.fecha_fin_c >= '${fechaInicio}'
    AND hr.fecha_inicio_c <= '${fechaFin}'
  `,

  // ESTA CONSULTA DEVUELVE LAS TAREAS SIN REGISTROS REPETIDOS
  // getListTareasPlan: (
  //   type: string,
  //   tarea_para: string,
  //   fechaInicio: string,
  //   fechaFin: string,
  // ) => `
  //    SELECT 
  //     ht.id,
  //     ht.name,
  //     ht.description,
  //     ht.iddivision_c, 
  //     hl.Value as division,
  //     ht.idamercado_c, 
  //     hl1.Value as amercado,
  //     ht.region_c, 
  //     hl2.Value as region,
  //     ht.tipo_tarea_c, 
  //     hl3.Value as tipotarea,
  //     ht.estado_c, 
  //     hl4.Value as estadotarea,
  //     ht.obligatorio_c,
  //     ht.tarea_para_c, 
  //     hl5.Value as tarea_para,
  //     hr.fecha_inicio_c as fecha_inicio_regla,
  //     hr.fecha_fin_c as fecha_fin_regla,
  //     hr.id as idRegla,
  //     MAX(harc.hanrt_reglasenrutamiento_accountsaccounts_idb) AS idCliente
  //     FROM hanrt_tareasplan ht 
  //     LEFT JOIN hanrt_reglasenrutamiento_hanrt_tareasplan_c hrhtc
  //         ON hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_tareasplan_idb = ht.id 
  //         AND hrhtc.deleted = 0
  //     LEFT JOIN hanrt_reglasenrutamiento hr
  //         ON hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_reglasenrutamiento_ida = hr.id 
  //         AND hr.deleted = 0 
  //     LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) 
  //         ON hl.ID = ht.iddivision_c 
  //         AND hl.ListId = 'hansa_divisiones_list'
  //     LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) 
  //         ON hl1.ID = ht.idamercado_c  
  //         AND hl1.ListId = 'hansa_amercado_list'
  //     LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) 
  //         ON hl2.ID = ht.region_c  
  //         AND hl2.ListId = 'hansa_dimregion_list'
  //     LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) 
  //         ON hl3.ID = ht.tipo_tarea_c  
  //         AND hl3.ListId = 'tipo_tarea_c_list'
  //     LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) 
  //         ON hl4.ID = ht.estado_c  
  //         AND hl4.ListId = 'hansa_estado_tarea_list'
  //     LEFT JOIN pro.hansacrm_list hl5 WITH (NOLOCK) 
  //         ON hl5.ID = ht.tarea_para_c  
  //         AND hl5.ListId = 'hansa_head_tarea_list'
  //     LEFT JOIN hanrt_reglasenrutamiento_accounts_c harc 
  //         ON harc.hanrt_reglasenrutamiento_accountshanrt_reglasenrutamiento_ida = hr.id 
  //         AND harc.deleted = 0
  //     WHERE ht.tipo_tarea_c = '${type}' 
  //       AND ht.deleted = '0' 
  //       AND ht.estado_c = 'E01' 
  //       AND ht.tarea_para_c = '${tarea_para}'
  //       AND hr.estado_c = 'ER01'
  //       AND hr.fecha_fin_c >= '${fechaInicio}'
  //       AND hr.fecha_inicio_c <= '${fechaFin}'
  //     GROUP BY 
  //         ht.id,
  //         ht.name,
  //         ht.description,
  //         ht.iddivision_c, 
  //         hl.Value,
  //         ht.idamercado_c, 
  //         hl1.Value,
  //         ht.region_c, 
  //         hl2.Value,
  //         ht.tipo_tarea_c, 
  //         hl3.Value,
  //         ht.estado_c, 
  //         hl4.Value,
  //         ht.obligatorio_c,
  //         ht.tarea_para_c, 
  //         hl5.Value,
  //         hr.fecha_inicio_c,
  //         hr.fecha_fin_c,
  //         hr.id;
  //   `,
};
