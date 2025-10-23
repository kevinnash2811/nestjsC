export const users = {
  Get_User: (iduser: string) => `
        SELECT u.id as id, 
            u.user_name as user_name,
            u.first_name as nombres, 
            u.last_name as apellidos, 
            uc.iddivision_c as iddivision, 
            hl.Value as division,
            uc.idamercado_c as idamercado, 
            hl2.Value  as amercado, 
            CASE
              WHEN uc.rol_hbm_c IN ('RHYV', 'RAPV', 'RRFFVVC', 'GAPV', 'GHYV', 'GGFFVVC') 
              THEN ISNULL(felc.idregion_c, '')
              ELSE uc.idregional_c 
            END
            as idregional,
            hl3.Value as regional,
            u.title as rol, 
            u.status as estado, 
            u.employee_status as activo,
            uc.idempleado_c  as codigo_empleado,
            uc.idvendedor_c as codigo_vendedor,
            u2.id as id_reponsable,
            u2.first_name as nombres_responsable,
            u2.last_name as apellidos_responsable,
            u.address_country as pais,
            uc.idgrupocliente_c as idgrupocliente,
            uc.fp_event_locations_id_c as idlocation,
            fel.name as namelocation,
            u.is_admin as is_admin,
            uc.hance_empresa_id_c as idempresa,
            uc.rol_hbm_c,
            hl4.Value as rol_hbm_label,
            ha.id as almacen_id,
            ha.name as almacen_name,
            --'upload/users/avatardefault.png' as avatar,
            CONCAT('upload/users/', u.id) as avatar,
            (
              SELECT ea.email_address, eabr.primary_address
                FROM email_addresses ea 
                LEFT JOIN email_addr_bean_rel eabr ON eabr.email_address_id = ea.id AND eabr.deleted ='0'
                WHERE eabr.bean_id=u.id AND ea.deleted ='0'
                FOR JSON PATH
            ) as email,
            ISNULL((SELECT 
              hc.id,
              hc.name,
              hc.fecha_inicio_hora_c,
              hc.fecha_fin_hora_c,
              hc.estado_c,
              hc.dias_c,
              hc.cantidad_visitas_dia_c,
              hc.horas_por_dia_c,
              hl.Value AS estado_c_label
            FROM hanrt_ciclos hc
            JOIN hanrt_ciclos_users_c hcuc ON hc.id = hcuc.hanrt_ciclos_usershanrt_ciclos_ida AND hcuc.deleted = 0
            LEFT JOIN pro.hansacrm_list hl ON hl.ListId = 'estado_ciclo_c' AND hl.ID = hc.estado_c
            WHERE u.id = hcuc.hanrt_ciclos_usersusers_idb 
            AND hc.deleted = 0
            AND (
                  CAST(DATEADD(HOUR, -4, hc.fecha_inicio_hora_c) AS DATE) >= CAST(GETDATE() AS DATE)
                  OR CAST(GETDATE() AS DATE) BETWEEN CAST(DATEADD(HOUR, -4, hc.fecha_inicio_hora_c) AS DATE) AND CAST(DATEADD(HOUR, -4, hc.fecha_fin_hora_c) AS DATE)
              )
            ORDER BY hc.fecha_inicio_hora_c
            FOR JSON PATH
            ), '[]') as ciclos
        FROM users u WITH (NOLOCK)
        LEFT JOIN users_cstm uc WITH (NOLOCK) ON uc.id_c = u.id
        LEFT JOIN dbo.fp_event_locations fel ON fel.id = uc.fp_event_locations_id_c AND fel.deleted = 0
        LEFT JOIN fp_event_locations_cstm felc ON fel.id = felc.id_c 
        LEFT JOIN users u2 WITH (NOLOCK) ON u2.id = u.reports_to_id
        LEFT JOIN hanf_almacen ha ON ha.id = uc.hanf_almacen_id_c
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = uc.iddivision_c  AND hl.ListId = 'hansa_divisiones_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = uc.idamercado_c  AND hl2.ListId = 'hansa_amercado_list'
        LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = felc.idregion_c AND hl3.ListId = 'hansa_dimregional_list'
        LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = uc.rol_hbm_c  AND hl4.ListId = 'roles_hbm_list'
        WHERE u.id ='${iduser}' AND u.deleted='0'
    `,
  Get_All_User: (
    division: string,
    amercado: string,
    reports_to_id?: string,
  ) => {
    let query = `
          SELECT DISTINCT u.id,
            CONCAT(
              (CASE
                WHEN u.first_name IS NULL THEN ''
                ELSE CONCAT(u.first_name, ' ')
              END),
              (CASE
                WHEN u.last_name IS NULL THEN ''
                ELSE u.last_name
              END)
            ) as user_name,
            hl.value as division,
            COALESCE(hl2.value, 'No asignado') as a_mercado,
            (CASE 
              WHEN u.photo is not null THEN CONCAT('/upload/users/', u.id) 
              ELSE '/upload/users/avatardefault.png'
            END) as avatar,
            u.employee_status,
            u.title as cargo,
            uc.iddivision_c,
            uc.idamercado_c,
            uc.idgrupocliente_c,
            uc.idregional_c,
            uc.idvendedor_c,
            ea.email_address as email
          FROM users u 
          LEFT JOIN users_cstm uc on u.id = uc.id_c
          LEFT JOIN email_addr_bean_rel eabr ON eabr.bean_id = u.id AND eabr.primary_address = 1 AND eabr.deleted = 0
          LEFT JOIN email_addresses ea ON ea.id = eabr.email_address_id AND ea.deleted = 0
          LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = uc.iddivision_c AND hl.ListId = 'hansa_divisiones_list'
          LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = uc.idamercado_c AND hl2.ListId = 'hansa_amercado_list'
          WHERE u.deleted = 0
        `;

    if (division) {
      query += ` AND uc.iddivision_c = '${division}'`;
    }

    if (amercado) {
      query += ` AND uc.idamercado_c = '${amercado}'`;
    }

    if (reports_to_id) {
      query += ` AND u.reports_to_id = '${reports_to_id}'`;
    }

    return query;
  },

  Get_Ids_Two_Levels: `SELECT @0 as id UNION
                    SELECT u.id FROM users u WHERE u.reports_to_id = @0`,

  getUsersBy_Ciclo: (idCiclo: string) => {
    let query = `
      SELECT  
        hc.id,
        hc.name as Ciclo,
        u.user_name,
        u.first_name,
        u.last_name,
        uu.first_name + ' ' + uu.last_name as Supervisor,
        uc.rol_hbm_c,
        u.status,
        u.title,
        uc.idvendedor_c,
        hl.Value as Division,
        hl2.Value as Mercado,
        hl3.Value as Region,
        (CASE 
              WHEN u.photo is not null THEN CONCAT('/upload/users/', u.id) 
              ELSE '/upload/users/avatardefault.png'
            END) as photo
        
      FROM 
        hanrt_ciclos hc
        LEFT JOIN hanrt_ciclos_users_c hcuc ON hcuc.hanrt_ciclos_usershanrt_ciclos_ida = hc.id
        LEFT JOIN users u ON u.id = hcuc.hanrt_ciclos_usersusers_idb
        LEFT JOIN users_cstm uc ON uc.id_c = u.id
        LEFT JOIN users uu ON uu.id = u.reports_to_id  
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = uc.iddivision_c AND hl.ListId = 'hansa_divisiones_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = uc.idamercado_c AND hl2.ListId = 'hansa_amercado_list'
        LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = uc.idregional_c AND hl3.ListId = 'hansa_dimregional_list'
      WHERE 
        hc.id = '${idCiclo}' 
        AND hc.deleted = 0
        AND u.deleted = 0
    `;

    return query;
  },
  getDataForConfig(id: string) {
    return `
      SELECT
        u.id,
        uc.rol_hbm_c
      FROM users u
      JOIN users_cstm uc ON u.id = uc.id_c
      WHERE u.id = '${id}' AND u.deleted = 0
    `;
  },
};
