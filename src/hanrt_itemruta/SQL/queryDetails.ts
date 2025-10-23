export const detailQuery = {
  detail: `
  DECLARE @routeId VARCHAR(36) = @0;

  SELECT 
    a.name AS accountName,
    ac.categoria_ventas_c AS categoriaVentas,
    ac.categoria_ventas02_c AS categoriaVentas02,
    c.id AS contactId,
    c.contactName,
    hi.tipo_visita_hbm_c AS tipoVisita,
    c.clasificacion_c AS clasificacionContact,
    c.especialidadName,
    CONCAT(u.first_name, ' ', u.last_name) AS [user],
    u.user_name AS userCode,
    uc.idregional_c AS userRegion,
    hl.Value AS regionName,
    hi.secuencia_c AS secuencia,
    hi.fecha_inicio_c AS fechaInicio,
    hi.fecha_fin_c AS fechaFin,
    hi.hora_inicio_c AS horaInicio,
    hi.hora_fin_c AS horaFin,
    hi.duracion_c AS duracion,
    'En Planificación' AS estado,
    ht.name AS tareaName,
    hv.id AS visitaId,
    hv.estado_c AS visitaEstado,
    hv.fechainireal_c AS fechaInicioReal,
    hv.fechafinreal_c AS fechaFinReal,
    hv.visita_ciclo_c AS visitado
  FROM hanrt_itemruta hi
  LEFT OUTER JOIN (
    SELECT 
      hv.id, 
      hv.estado_c,
      hv.fechainireal_c,
      hv.fechafinreal_c,
      hv.visita_ciclo_c
    FROM hana_visitas hv
  ) hv ON hv.id = hi.id
  JOIN hanrt_itemruta_accounts_c hiac ON hi.id = hiac.hanrt_itemruta_accountshanrt_itemruta_idb
  JOIN users u ON u.id = hi.assigned_user_id AND u.deleted = 0
  LEFT JOIN users_cstm uc ON uc.id_c = u.id
  LEFT JOIN pro.hansacrm_list hl ON hl.ID = uc.idregional_c AND hl.ListId = 'hansa_dimregional_list'
  JOIN accounts a ON a.id = hiac.hanrt_itemruta_accountsaccounts_ida
  JOIN accounts_cstm ac ON a.id = ac.id_c
  LEFT OUTER JOIN (
    SELECT hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida AS rutaId, ht.* FROM hanrt_tareasplan ht
    JOIN hanrt_itemruta_hanrt_tareasplan_c hihtc ON ht.id = hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb
  ) ht ON ht.rutaId = hi.id 
  LEFT OUTER JOIN (
    SELECT 
      c.id, 
      cc.clasificacion_c,
      hicc.hanrt_itemruta_contactshanrt_itemruta_idb AS rutaId, 
      CONCAT(c.salutation, ' ',c.first_name, CASE WHEN c.first_name IS NULL OR c.first_name = '' THEN '' ELSE ' ' END, c.last_name) AS contactName,
      he.name AS especialidadName
    FROM hanrt_itemruta_contacts_c hicc
    JOIN contacts c ON hicc.hanrt_itemruta_contactscontacts_ida = c.id AND c.deleted = 0
    JOIN contacts_cstm cc ON cc.id_c = c.id 
    LEFT OUTER JOIN (
      SELECT 
        he.id, 
        he.name, 
        hecc.hanvc_especialidades_contactscontacts_idb as contact_id 
      FROM hanvc_especialidades_contacts_c hecc
      JOIN hanvc_especialidades he ON he.id = hecc.hanvc_especialidades_contactshanvc_especialidades_ida AND he.deleted = 0 
      WHERE hecc.deleted = 0 AND hecc.es_principal_c = 1
    ) AS he ON he.contact_id = c.id
    WHERE hicc.deleted = 0
  ) c ON c.rutaId = hi.id
  WHERE hi.id = @routeId;
  `,
  tasks: `
  SELECT 
    t.id,
	  t.name,
	  t.date_start AS fechaInicio,
    t.date_due AS fechaFin,
    t.status AS estadoId,
    hl.Value AS estado,
	  ISNULL(d.documentsCount, 0) AS documentsCount,
    tc.obligatorio_c AS obligatorioC,
    tc.tipotarea_c AS type
	FROM tasks t
  JOIN tasks_cstm tc ON t.id = tc.id_c
	LEFT JOIN pro.hansacrm_list hl ON hl.ID = CONCAT('t_', t.status) AND hl.ListId = 'hansa_status_activities_list'
	LEFT OUTER JOIN (
		SELECT dtc.documents_tasks_1tasks_idb AS taskId, COUNT(*) AS documentsCount FROM documents d
		JOIN documents_tasks_1_c dtc ON d.id = dtc.documents_tasks_1documents_ida AND dtc.deleted = 0
		WHERE d.deleted = 0
		GROUP BY dtc.documents_tasks_1tasks_idb
	) d ON d.taskId = t.id
	WHERE t.parent_type = 'HANA_Visitas' AND t.parent_id = @0
  `,
  module: (module: string) => `
  SELECT COUNT(*) AS count FROM ${module}
  WHERE parent_id = @1 AND parent_type = 'Tasks'
  GROUP BY parent_id
  `,
  planTask: `
  SELECT
    ht.id,
    ht.name,
    hi.fecha_inicio_c AS fechaInicio,
    hi.fecha_fin_c AS fechaFin,
    'Planificada' AS estadoId,
    'Planificada' AS estado,
    0 AS documentsCount,
    ht.obligatorio_c AS obligatorioC,
    ht.tipo_tarea_c AS type
  FROM hanrt_tareasplan ht
  JOIN hanrt_itemruta_hanrt_tareasplan_c hihtc 
  ON ht.id = hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb AND hihtc.deleted = 0
  JOIN hanrt_itemruta hi 
  ON hi.id = hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida AND hi.deleted = 0
  WHERE hi.id = @0
  `,
};