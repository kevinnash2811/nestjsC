export const items = {
  Get_ItemRuta: (
    fechainiplan_c: string,
    fechafinplan_c: string,
    assigned_user_id: string,
    ciclo_id: string,
  ) => `
      EXEC [map].Hanrt_ItemRuta_BeforePlan
      @fechainiplan_c = '${fechainiplan_c}',
      @fechafinplan_c = '${fechafinplan_c}',
      @assigned_user_id = '${assigned_user_id}',
      @ciclo_id = '${ciclo_id}'
    `,
  Get_ItemRutaVisita: (
    assigned_user_id: string,
    customerid_c: string,
    idContacto: string,
    idCiclo,
  ) => `
      SELECT
          c.salutation + '' + c.last_name as nombreContacto,
          cc.clasificacion_c as categoria,
          hv.fechainiplan_c as fechaVisita,
          hv.estado_c as estado,
          he.name as especialidad,
          (
              SELECT 
              t.id,
              t.name,
              hl.Value as estado
              
              FROM tasks t 
              LEFT JOIN pro.hansacrm_list hl ON hl.ID = t.status AND hl.ListId = 'hansa_status_tasks_crm_hbm_list'
              WHERE t.parent_id = hv.id AND t.deleted = 0
              FOR JSON PATH
          ) as tareas,
        hf2.cantidad_visitas_c as frecuencia
        
      FROM hana_visitas hv 
      INNER JOIN contacts c ON c.id = hv.contacto_id_c
      INNER JOIN contacts_cstm cc ON cc.id_c = c.id
      LEFT JOIN hanvc_especialidades_contacts_c hecc ON hecc.hanvc_especialidades_contactscontacts_idb = c.id AND hecc.deleted = 0
      LEFT JOIN hanvc_especialidades he ON he.id = hecc.hanvc_especialidades_contactshanvc_especialidades_ida AND he.deleted = 0
      LEFT JOIN hanrt_ciclos hc ON CAST(DATEADD(HOUR, -4, hv.fechainireal_c) AS DATE) BETWEEN hc.fecha_inicio_hora_c AND hc.fecha_fin_hora_c AND hc.deleted = 0 
      LEFT JOIN hanrt_ciclos_hanrt_frecuencias_c hchc ON hchc.hanrt_ciclos_hanrt_frecuenciashanrt_ciclos_idb = hc.id AND hchc.deleted = 0
      LEFT JOIN hanrt_frecuencias hf ON hf.id = hchc.hanrt_ciclos_hanrt_frecuenciashanrt_frecuencias_ida AND hf.deleted = 0
      LEFT JOIN (
          SELECT 
              hfhfc.hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuencias_ida as frecuencia_id,
              hf2.cantidad_visitas_c,
              hf2.valor_campo
          FROM 
              hanrt_frecuencias_hanrt_frecuenciadetalle_c hfhfc
              JOIN hanrt_frecuenciadetalle hf2 ON hf2.id = hfhfc.hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuenciadetalle_idb
          WHERE 
              hfhfc.deleted = 0
              AND hf2.deleted = 0
      ) hf2 ON hf2.frecuencia_id = hf.id AND hf2.valor_campo = cc.clasificacion_c

      WHERE 
      hv.assigned_user_id = '${assigned_user_id}'
      AND hv.customerid_c = '${customerid_c}'
      AND c.id = '${idContacto}'
      AND hc.id = '${idCiclo}'
      AND hv.deleted = 0
      AND c.deleted = 0

      ORDER BY hv.fechainireal_c ASC
    `,
  Get_ItemRutaPlanificador: (
    assigned_user_id: string,
    customerid_c: string,
    idContacto: string,
    idCiclo,
  ) => `
      SELECT 
      c.salutation + '' + c.last_name as nombreContacto,
      cc.clasificacion_c as categoria,
      hi.fecha_inicio_c as fechaVisita,
      '' as estado,
      he.name as especialidad,
      (
              SELECT 
              ht.id,
              ht.name,
              '' as estado
              FROM hanrt_itemruta_hanrt_tareasplan_c hihtc  
              LEFT JOIN hanrt_tareasplan ht ON ht.id = hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb
              WHERE hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida = hi.id AND hihtc.deleted = 0
              FOR JSON PATH
          ) as tareas,
      hf2.cantidad_visitas_c as frecuencia

      FROM 
      hanrt_itemruta hi
      LEFT JOIN hanrt_itemruta_contacts_c hicc ON hicc.hanrt_itemruta_contactshanrt_itemruta_idb = hi.id 
      LEFT JOIN contacts c on c.id = hicc.hanrt_itemruta_contactscontacts_ida 
      LEFT JOIN contacts_cstm cc ON cc.id_c = c.id
      LEFT JOIN hanvc_especialidades_contacts_c hecc ON hecc.hanvc_especialidades_contactscontacts_idb = c.id
      LEFT JOIN hanvc_especialidades he ON he.id = hecc.hanvc_especialidades_contactshanvc_especialidades_ida
      LEFT JOIN hanrt_itemgroup_hanrt_itemruta_c hihic ON hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb = hi.id
      LEFT JOIN hanrt_itemgroup hig ON hig.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida
      LEFT JOIN hanrt_planificador_hanrt_itemgroup_c hphic ON hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb = hig.id
      LEFT JOIN hanrt_planificador hp ON hp.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida
      LEFT JOIN hanrt_ciclos_hanrt_planificador_c hchc ON hchc.hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb = hp.id
      LEFT JOIN hanrt_ciclos hc2 ON hc2.id = hchc.hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida
      LEFT JOIN hanrt_ciclos_hanrt_frecuencias_c hchc2 ON hchc2.hanrt_ciclos_hanrt_frecuenciashanrt_ciclos_idb = hc2.id AND hchc2.deleted = 0
      LEFT JOIN hanrt_frecuencias hf ON hf.id = hchc2.hanrt_ciclos_hanrt_frecuenciashanrt_frecuencias_ida AND hf.deleted = 0
      LEFT JOIN (
          SELECT 
              hfhfc.hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuencias_ida as frecuencia_id,
              hf2.cantidad_visitas_c,
              hf2.valor_campo
          FROM 
              hanrt_frecuencias_hanrt_frecuenciadetalle_c hfhfc
              JOIN hanrt_frecuenciadetalle hf2 ON hf2.id = hfhfc.hanrt_frecuencias_hanrt_frecuenciadetallehanrt_frecuenciadetalle_idb
          WHERE 
              hfhfc.deleted = 0
              AND hf2.deleted = 0
      ) hf2 ON hf2.frecuencia_id = hf.id AND hf2.valor_campo = cc.clasificacion_c

      WHERE
      hi.assigned_user_id = '${assigned_user_id}'
      AND hicc.hanrt_itemruta_contactscontacts_ida = '${customerid_c}'
      AND c.id = '${idContacto}'
      AND hc2.id = '${idCiclo}'                   

      ORDER BY hi.fecha_inicio_c ASC
    `,
  Get_Markers: (id: string) => `
  SELECT hi.id, hi.name, ac.jjwg_maps_lat_c as lat, ac.jjwg_maps_lng_c as lng FROM hanrt_itemruta hi 
  JOIN hanrt_itemgroup_hanrt_itemruta_c hihic ON hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb  = hi.id AND hihic.deleted = 0
  JOIN hanrt_itemruta_accounts_c hiac ON hiac.hanrt_itemruta_accountshanrt_itemruta_idb = hi.id AND hiac.deleted = 0  
  JOIN accounts_cstm ac ON hiac.hanrt_itemruta_accountsaccounts_ida = ac.id_c
  WHERE hi.deleted  = 0 AND ac.jjwg_maps_lat_c IS NOT NULL AND ac.jjwg_maps_lng_c IS NOT NULL
  AND ac.jjwg_maps_lat_c <> '' AND ac.jjwg_maps_lng_c <> ''
  AND ac.jjwg_maps_lat_c <> '0' AND ac.jjwg_maps_lng_c <> '0'
  AND hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida  = '${id}'
  ORDER BY hi.secuencia_c
  `,
  Get_CustomerPlanVisits: `
    DECLARE @accountId VARCHAR(50) = @0;
    DECLARE @contactId VARCHAR(50) = @1;
    DECLARE @userId VARCHAR(50) = @2;
    DECLARE @cicloId VARCHAR(50) = @3;

    DECLARE @fechaInicio DATETIME = NULL;
    DECLARE @fechaFin DATETIME = NULL;
    DECLARE @cicloName VARCHAR(50) = NULL;

    SELECT @fechaInicio= hc.fecha_inicio_hora_c, @fechaFin = hc.fecha_fin_hora_c, @cicloName = hc.name FROM hanrt_ciclos hc
    WHERE hc.id = @cicloId;

    SELECT
      hi.id,
      a.name AS accountName,
      a.account_type,
      CONCAT(c.salutation, ' ', c.first_name, ' ', c.last_name) AS contactName,
      cc.clasificacion_c AS contactCategory,
      'EN PLANIFICACIÓN' AS estado_c,
      hi.tipo_visita_hbm_c,
      he.id AS especialidadId, 
      he.name AS especialidadName,
      hi.secuencia_c,
      hi.fecha_inicio_c AS fecha_inicio_c,
      hi.hora_inicio_c AS hora_inicio_c,
      hi.duracion_c AS duracion_c,
      hi.fecha_fin_c AS fecha_fin_c,
      hi.hora_fin_c AS hora_fin_c,
      ht.tasksCount,
      NULL AS nro_visita_c,
      NULL AS visita_ciclo_c,
      hc.id AS cicloId,
      hc.name AS cicloName,
      a.billing_address_street AS address,
      hp.name AS planName,
      hp.id AS planId
    FROM hanrt_itemruta hi 
    JOIN hanrt_itemgroup_hanrt_itemruta_c hihic ON hi.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb AND hihic.deleted = 0
    JOIN hanrt_itemruta_contacts_c hicc ON hi.id = hicc.hanrt_itemruta_contactshanrt_itemruta_idb AND hicc.deleted = 0
    JOIN contacts c ON c.id = hicc.hanrt_itemruta_contactscontacts_ida AND c.id = @contactId AND c.deleted = 0
    JOIN contacts_cstm cc ON c.id = cc.id_c
    LEFT OUTER JOIN (
      SELECT he.id, he.name, hecc.hanvc_especialidades_contactscontacts_idb AS contactId  
      FROM hanvc_especialidades he
      JOIN hanvc_especialidades_contacts_c hecc ON he.id = hecc.hanvc_especialidades_contactshanvc_especialidades_ida AND hecc.es_principal_c = 1 AND hecc.deleted = 0
    ) he ON he.contactId = c.id
    JOIN accounts a ON c.lead_source = a.sic_code AND a.deleted = 0
    JOIN hanrt_itemgroup hi2 ON hi2.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida AND hi2.deleted = 0
    JOIN hanrt_planificador_hanrt_itemgroup_c hphic ON hi2.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb AND hphic.deleted = 0 
    JOIN hanrt_planificador hp ON hp.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida AND hp.deleted = 0 AND hp.estado_planificacion_c = 'EP02'
    JOIN hanrt_ciclos_hanrt_planificador_c hchpc ON hchpc.hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb = hp.id AND hchpc.deleted = 0 AND hchpc.hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida = @cicloId
    JOIN hanrt_ciclos hc ON hc.id = hchpc.hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida AND hc.deleted = 0
    LEFT OUTER JOIN (
      SELECT hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida AS rutaId, COUNT(*) AS tasksCount 
      FROM hanrt_tareasplan ht 
      JOIN hanrt_itemruta_hanrt_tareasplan_c hihtc ON ht.id = hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb AND hihtc.deleted = 0
      WHERE ht.deleted = 0
      GROUP BY hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida 
    ) ht ON ht.rutaId = hi.id
    WHERE hi.deleted = 0
    AND hi.assigned_user_id = @userId
    AND hi.id NOT IN (SELECT hv.id FROM hana_visitas hv WHERE hv.deleted = 0);
  `,
  Get_CustomerRealVisits: `
    DECLARE @accountId VARCHAR(50) = @0;
    DECLARE @contactId VARCHAR(50) = @1;
    DECLARE @userId VARCHAR(50) = @2;
    DECLARE @cicloId VARCHAR(50) = @3;

    DECLARE @fechaInicio DATETIME = NULL;
    DECLARE @fechaFin DATETIME = NULL;
    DECLARE @cicloName VARCHAR(50) = NULL;

    SELECT @fechaInicio= hc.fecha_inicio_hora_c, @fechaFin = hc.fecha_fin_hora_c, @cicloName = hc.name FROM hanrt_ciclos hc
    WHERE hc.id = @cicloId;

    SELECT 
      hv.id,
      a.name AS accountName,
      a.account_type,
      CONCAT(c.salutation, ' ', c.first_name, ' ', c.last_name) AS contactName,
      cc.clasificacion_c AS contactCategory,
      hv.estado_c,
      hv.tipo_visita_c AS tipo_visita_hbm_c,
      he.id AS especialidadId, 
      he.name AS especialidadName,
      hv.fechainiplan_c AS fecha_inicio_c,
      hv.fechainiplan_c AS hora_inicio_c,
      CONVERT(VARCHAR(16), DATEADD(MINUTE, DATEDIFF(MINUTE, hv.fechainiplan_c, hv.fechafinplan_c), '1900-01-01'), 120) AS duracion_c,
      hv.fechafinplan_c AS fecha_fin_c,
      hv.fechafinplan_c AS hora_fin_c,
      t.tasksCount,
      hv.nro_visita_c,
      hv.visita_ciclo_c,
      @cicloId AS cicloId,
      @cicloName AS cicloName,
      a.billing_address_street AS address
    FROM hana_visitas hv
    JOIN accounts a ON hv.customerid_c = a.id
    JOIN contacts c ON c.id = hv.contacto_id_c AND c.id = @contactId AND c.deleted = 0
    JOIN contacts_cstm cc ON c.id = cc.id_c
    LEFT OUTER JOIN (
      SELECT he.id, he.name, hecc.hanvc_especialidades_contactscontacts_idb AS contactId  
      FROM hanvc_especialidades he
      JOIN hanvc_especialidades_contacts_c hecc 
        ON he.id = hecc.hanvc_especialidades_contactshanvc_especialidades_ida 
        AND hecc.es_principal_c = 1 
        AND hecc.deleted = 0
    ) he ON he.contactId = hv.contacto_id_c
    LEFT OUTER JOIN (
      SELECT hv.id AS visitId, COUNT(*) AS tasksCount 
      FROM tasks t
      JOIN hana_visitas hv ON hv.id = t.parent_id AND t.parent_type = 'HANA_Visitas' AND hv.deleted = 0
      WHERE t.deleted = 0
      GROUP BY hv.id
    ) t ON t.visitId = hv.id
    WHERE hv.assigned_user_id = @userId
    AND CAST(hv.fechainiplan_c AS DATE) BETWEEN CAST(DATEADD(HOUR, -4, @fechaInicio) AS DATE) AND CAST(DATEADD(HOUR, -4, @fechaFin) AS DATE)
    --AND hv.estado_c IN ('POR INICIAR')
  `,
};
