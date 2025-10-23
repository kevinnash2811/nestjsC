export const hanrt_planificador = {
  Get_Hanr_Planifidor_By_Id: (idplanificador: string) => `
        SELECT  hp.id,
                hp.name,  
                hc.id as idCiclo,
                hc.name as nameCiclo,
                hc.fecha_inicio_hora_c as fechaInicioCiclo,
                hc.fecha_fin_hora_c as fechaFinCiclo,
                hc.estado_c as estadoCiclo,
                hc.cantidad_visitas_dia_c as cantidadVisitasDiaCiclo,
                hc.dias_c as diasCiclo,
                hc.horas_por_dia_c as horasPorDiaCiclo,
                hll.Value as estadoValorCiclo,
                hp.iddivision_c, hl1.Value as division, 
                hp.idamercado_c, hl2.Value as amercado, 
                hp.region_c, hl3.Value as regional, hp.canal_c as canal_c,
                hp.tipo, hl.Value as tipo_label,
                hp.estado_planificacion_c, hl4.Value as estado,
                hp.date_entered as fecha_creacion, 
                hp.description as descripcion,
                DATEADD(hour, -4, hp.fecha_inicio_c) as fecha_inicio_c,
                DATEADD(hour, -4, hp.fecha_fin_c) as fecha_fin_c
        FROM hanrt_planificador hp 
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hp.tipo  AND hl.ListId = 'hansa_tipoplanificacion_list'
        LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = hp.iddivision_c  AND hl1.ListId = 'hansa_divisiones_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = hp.idamercado_c  AND hl2.ListId = 'hansa_amercado_list'
        LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = hp.region_c  AND hl3.ListId = 'hansa_dimregion_list'
        LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = hp.estado_planificacion_c  AND hl4.ListId = 'estado_planificacion_c_list'
        LEFT JOIN hanrt_ciclos_hanrt_planificador_c hchpc ON hp.id = hchpc.hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb AND hchpc.deleted = 0
        LEFT JOIN hanrt_ciclos hc ON hc.id = hchpc.hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida AND hc.deleted = 0
        LEFT JOIN pro.hansacrm_list hll ON hll.ListId = 'estado_ciclo_c' AND hll.ID = hc.estado_c

        WHERE hp.id='${idplanificador}' AND hp.deleted ='0'
    `,
    Get_Hanr_Planifidor_By_Id_V2: (idplanificador: string) => `
        SELECT  hp.id,
                hp.name,  
                hc.id as idCiclo,
                hc.name as nameCiclo,
                hc.fecha_inicio_hora_c as fechaInicioCiclo,
                hc.fecha_fin_hora_c as fechaFinCiclo,
                hc.estado_c as estadoCiclo,
                hc.cantidad_visitas_dia_c as cantidadVisitasDiaCiclo,
                hc.dias_c as diasCiclo,
                hc.horas_por_dia_c as horasPorDiaCiclo,
                hll.Value as estadoValorCiclo,
                hp.assigned_user_id,
                hp.iddivision_c, hl1.Value as division, 
                hp.idamercado_c, hl2.Value as amercado, 
                hp.region_c, hl3.Value as regional, hp.canal_c as canal_c,
                hp.tipo, hl.Value as tipo_label,
                hp.estado_planificacion_c, hl4.Value as estado,
                hp.date_entered as fecha_creacion, 
                hp.description as descripcion,
                hp.fecha_inicio_c as fecha_inicio_c,
                hp.fecha_fin_c as fecha_fin_c
        FROM hanrt_planificador hp 
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hp.tipo  AND hl.ListId = 'hansa_tipoplanificacion_list'
        LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = hp.iddivision_c  AND hl1.ListId = 'hansa_divisiones_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = hp.idamercado_c  AND hl2.ListId = 'hansa_amercado_list'
        LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = hp.region_c  AND hl3.ListId = 'hansa_dimregion_list'
        LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = hp.estado_planificacion_c  AND hl4.ListId = 'estado_planificacion_c_list'
        LEFT JOIN hanrt_ciclos_hanrt_planificador_c hchpc ON hp.id = hchpc.hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb AND hchpc.deleted = 0
        LEFT JOIN hanrt_ciclos hc ON hc.id = hchpc.hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida AND hc.deleted = 0
        LEFT JOIN pro.hansacrm_list hll ON hll.ListId = 'estado_ciclo_c' AND hll.ID = hc.estado_c

        WHERE hp.id='${idplanificador}' AND hp.deleted ='0'
    `,

  Get_TareasCabecera_By_Id: (idplanificador: string) => `
         SELECT DISTINCT
            ht.id,
            ht.name,
            ht.description,
            ht.iddivision_c, 
            hl.Value as division,
            ht.idamercado_c, 
            hl1.Value as amercado,
            ht.region_c, 
            hl2.Value as region,
            ht.tipo_tarea_c, 
            hl3.Value as tipotarea,
            ht.estado_c, 
            hl4.Value as estadotarea,
            ht.obligatorio_c,
            ht.tarea_para_c, 
            hl5.Value as tarea_para,
            hr.fecha_inicio_c as fecha_inicio_regla,
            hr.fecha_fin_c as fecha_fin_regla,
            hr.id as idRegla
        FROM 
            hanrt_planificador hp 
            JOIN hanrt_reglasenrutamiento hr ON CAST(hp.fecha_inicio_c AS DATE) BETWEEN CAST(hr.fecha_inicio_c AS DATE) AND CAST(hr.fecha_fin_c AS DATE)
            JOIN hanrt_reglasenrutamiento_hanrt_tareasplan_c hrhtc ON hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_reglasenrutamiento_ida = hr.id
            JOIN hanrt_tareasplan ht ON ht.id = hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_tareasplan_idb
            JOIN hanrt_itemruta_hanrt_tareasplan_c hihtc ON hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb = ht.id
            JOIN hanrt_itemruta hi ON hi.id = hihtc.hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = ht.iddivision_c AND hl.ListId = 'hansa_divisiones_list'
            LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = ht.idamercado_c  AND hl1.ListId = 'hansa_amercado_list'
            LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = ht.region_c  AND hl2.ListId = 'hansa_dimregion_list'
            LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = ht.tipo_tarea_c  AND hl3.ListId = 'tipo_tarea_c_list'
            LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = ht.estado_c  AND hl4.ListId = 'hansa_estado_tarea_list'
            LEFT JOIN pro.hansacrm_list hl5 WITH (NOLOCK) ON hl5.ID = ht.tarea_para_c  AND hl5.ListId = 'hansa_head_tarea_list'
        WHERE 
            hp.id = '${idplanificador}'
            AND hp.tipo = ht.tipo_tarea_c
            AND ht.tarea_para_c = 'H01'
            AND ht.estado_c = 'E01'
            AND hp.deleted = 0
            AND hr.deleted = 0
            AND hrhtc.deleted = 0
            AND ht.deleted = 0
            AND hihtc.deleted = 0
            AND hi.deleted = 0
            AND hr.estado_c = 'ER01'
        
    `,
  Get_Users_Hanr_Planificador: (idplanificador: string) => `
        SELECT 
            u.id, 
            COALESCE(u.first_name, '') as first_name,
            u.last_name,
            u.title,
            uc.iddivision_c, hl.Value as division,
            uc.idamercado_c, hl1.Value as amercado,
            uc.idempleado_c,
            uc.idvendedor_c,
            uc.rol_hbm_c, hl2.Value as rol_hbm_label_c
        FROM users u
        LEFT JOIN users_cstm uc ON uc.id_c = u.id
        LEFT JOIN hanrt_planificador hp ON hp.assigned_user_id = u.id AND hp.deleted ='0'
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = uc.iddivision_c  AND hl.ListId = 'hansa_divisiones_list'
        LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = uc.idamercado_c  AND hl1.ListId = 'hansa_amercado_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = uc.rol_hbm_c  AND hl2.ListId = 'roles_hbm_list'
        WHERE hp.id ='${idplanificador}' AND u.deleted ='0'
    `,
  Get_Vehiculos_Hanr_Planificador: (idplanificador: string) => `
    SELECT  
        hv.id, 
        hv.name, 
        hv.amercado as amercado_c, hl1.Value as amercado_label_c, 
        hv.division as iddivision_c, hl.Value as division_label_c, 
        hv.regional as regional_c, hl4.Value as regional_label_c,
        hv.capacidad_1_c,
        hv.tipo_auto as tipo_auto_c,
        hv.estado_vehiculo_c, hl3.Value as estado_vehiculo_label,
        (SELECT
            hc.name,
            hc.assigned_user_id as user_id,
            hl.ID as tipo_c,
            hl.Value as tipo_c_label,
            uc.iddivision_c as user_iddivision_c, hl2.Value as user_division_c,
            uc.idamercado_c as user_idamercado_c, hl3.Value as user_amercado_c,
            uc.idregional_c as user_idregional_c, hl4.Value as user_regional_c,
            CONCAT(
            (CASE
                WHEN u.first_name IS NULL THEN ''
                ELSE CONCAT(u.first_name, ' ')
            END),
            (CASE
                WHEN u.last_name IS NULL THEN ''
                ELSE u.last_name
            END)
            ) as user_name
            FROM 
                hanrt_conductor hc
            INNER JOIN hanrt_conductor_hans_vehiculos_c hchvc 
                ON hc.id = hchvc.hanrt_conductor_hans_vehiculoshanrt_conductor_idb
                AND hv.id = hchvc.hanrt_conductor_hans_vehiculoshans_vehiculos_ida 
                AND hchvc.deleted = 0
                AND hc.deleted = 0
            LEFT JOIN users u
                ON u.id = hc.assigned_user_id
                AND u.deleted = 0
            LEFT JOIN users_cstm uc
                ON uc.id_c = u.id											
            LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hc.tipo_c AND hl.ListId ='hansa_tipo_conductor_list'
            LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = uc.iddivision_c  AND hl2.ListId = 'hansa_divisiones_list'
            LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = uc.idamercado_c  AND hl3.ListId = 'hansa_amercado_list'
            LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = uc.idregional_c  AND hl4.ListId = 'hansa_dimregional_list'
            FOR JSON PATH
        ) as conductores
    FROM hans_vehiculos hv 
    LEFT JOIN hanrt_planificador_hans_vehiculos_c hphvc ON hphvc.hanrt_planificador_hans_vehiculoshans_vehiculos_idb = hv.id AND hphvc.deleted = 0
    LEFT JOIN hanrt_planificador hp ON hp.id = hphvc.hanrt_planificador_hans_vehiculoshanrt_planificador_ida AND hp.deleted = 0
    LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hv.division  AND hl.ListId = 'hansa_divisiones_list'
    LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = hv.amercado  AND hl1.ListId = 'hansa_amercado_list'
    LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = hv.estado_vehiculo_c AND hl3.ListId = 'hansa_estado_vehiculo_list_c'
    LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = hv.regional AND hl4.ListId = 'hansa_dimregional_list'
    WHERE hp.id = '${idplanificador}' AND hv.deleted = 0
    `,
  Get_Group_Ruta_Hanr_Planificador: (idplanificador: string) => `
        SELECT hi.id as group_id,
              hi.secuencia_c as group_secuencia_c,
              hi.name as group_name_c, 
              FORMAT(hi.fecha_plan_c, 'dd-MM-yyyy') as group_fecha_plan_c,
              u.id as group_user_id,
              CONCAT(
                (CASE
                    WHEN u.first_name IS NULL THEN ''
                    ELSE CONCAT(u.first_name, ' ')
                END),
                (CASE
                    WHEN u.last_name IS NULL THEN ''
                    ELSE u.last_name
                END)
              ) as group_usuario,
              hv.id as group_id_vehiculo,
              hv.name as group_placa,
              hi.capacidad_c as group_capacidad_c,
              FORMAT(DATEADD(hour, -4, hi.hora_inicio_c), 'HH:mm') as group_hora_inicio_c,
              FORMAT(DATEADD(hour, -4, hi.duracion_c), 'HH:mm') as group_duracion_c,
              FORMAT(DATEADD(hour, -4, hi.hora_fin_c), 'HH:mm') as group_hora_fin_c,
              hi2.id as ruta_id,
              hi2.secuencia_c as ruta_secuencia,
              hi2.name as ruta_name,
              hi2.tipo_visita_c as ruta_tipo_visita,
              hl.Value as ruta_tipo_visita_label,
              FORMAT(hi2.fecha_inicio_c, 'dd-MM-yyyy') as ruta_fecha_inicio_c,
              FORMAT(DATEADD(hour, -4, hi2.hora_inicio_c), 'HH:mm') as ruta_hora_inicio_c,
              FORMAT(DATEADD(hour, -4, hi2.duracion_c), 'HH:mm') as ruta_duracion_c,
              FORMAT(hi2.fecha_fin_c, 'dd-MM-yyyy') as ruta_fecha_fin_c,
              FORMAT(DATEADD(hour, -4, hi2.hora_fin_c), 'HH:mm') as ruta_hora_fin_c,
              a.id as ruta_id_account,
              ISNULL(
              CASE 
                  WHEN ac.tipocuenta_c = 'Empresa' THEN a.name 
                  ELSE NULLIF(CONCAT(ac.names_c, ' ', ac.lastname_c), ' ')
              END, NULL) as ruta_name_account,
              a.billing_address_street as ruta_address_account,
              ac.categoria_ventas_c as ruta_category_account,
              (SELECT DISTINCT
                  hl.Value 
                  FROM pro.hansacrm_list hl 
                  LEFT JOIN hana_relaciones_accounts_c hrac 
                  ON hrac.zona_ventas_c = hl.ID
                  WHERE hrac.hana_relaciones_accountsaccounts_ida = a.id
                  AND hl.ListId = 'hansa_dimzona_ventas_list'	
              ) as ruta_usuario_zona_ventas_c,
              hi2.jjwg_maps_lat_c as ruta_latitud,
              hi2.jjwg_maps_lng_c as ruta_longitud,
              hi2.assigned_user_id as ruta_assigned_user_id,
              CONCAT(
                (CASE
                    WHEN u2.first_name IS NULL THEN ''
                    ELSE CONCAT(u2.first_name, ' ')
                END),
                (CASE
                    WHEN u2.last_name IS NULL THEN ''
                    ELSE u2.last_name
                END)
              ) as ruta_usuario_asignado,
              hr.id as regla_id,
              hr.name as regla_name,
              FORMAT(DATEADD(hour, -4, hr.fecha_inicio_c), 'dd-MM-yyyy HH:mm') as regla_fecha_inicio_c,
		      FORMAT(DATEADD(hour, -4, hr.fecha_fin_c), 'dd-MM-yyyy HH:mm') as regla_fecha_fin_c,
              hr.estado_c as regla_estado_c, hl1.Value as regla_estado_label,
              hr.tipo_regla_c as regla_tipo_regla_c, hl2.Value as regla_tipo_regla_label,
              ht.id as tarea_id,
              ht.name as tarea_name,
              ht.estado_c as tarea_estado_c, hl3.Value as tarea_estado_c_label,
              ht.obligatorio_c as tarea_obligatorio_c,
              he.id as entrega_id,
              he.name as entrega_name,   
              he.estado_c as entrega_estado_c,
              he.fecha_entrega_c as entrega_fecha_entrega_c
        FROM hanrt_itemgroup hi 
        LEFT JOIN hanrt_planificador_hanrt_itemgroup_c hphic ON hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb = hi.id AND hphic.deleted='0'
        LEFT JOIN hanrt_planificador hp ON hp.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida AND hp.deleted ='0'
        LEFT JOIN users u ON u.id = hi.assigned_user_id AND u.deleted ='0'
        LEFT JOIN users_cstm uc ON uc.id_c = u.id
        LEFT JOIN hanrt_itemgroup_hans_vehiculos_c hihvc ON hihvc.hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb = hi.id AND hihvc.deleted ='0'
        LEFT JOIN hans_vehiculos hv ON hv.id = hihvc.hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida AND hv.deleted ='0'
        LEFT JOIN hanrt_itemgroup_hanrt_itemruta_c hihic ON hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida = hi.id AND hphic.deleted ='0'
        LEFT JOIn hanrt_itemruta hi2 ON hi2.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb AND hi2.deleted ='0'
        LEFT JOIN hanrt_itemruta_accounts_c hiac ON hiac.hanrt_itemruta_accountshanrt_itemruta_idb = hi2.id AND hiac.deleted='0'
        LEFT JOIN accounts a ON a.id = hiac.hanrt_itemruta_accountsaccounts_ida AND a.deleted ='0'
        LEFT JOIN accounts_cstm ac ON ac.id_c = a.id
        LEFT JOIN users u2 ON u2.id  = hi2.assigned_user_id AND u2.deleted ='0'
        LEFT JOIN hanrt_reglasenrutamiento_accounts_c hrac ON hrac.hanrt_reglasenrutamiento_accountsaccounts_idb  = a.id AND hrac.deleted ='0'
        LEFT JOIN hanrt_itemruta_hane_entregas_c hihiec ON hihiec.hanrt_itemruta_hane_entregashanrt_itemruta_ida = hi2.id AND hihiec.deleted ='0'
        LEFT JOIN hane_entregas he ON he.id = hihiec.hanrt_itemruta_hane_entregashane_entregas_idb AND he.deleted ='0'
        LEFT JOIN (
                    SELECT *
                    FROM hanrt_reglasenrutamiento hr 
                    WHERE hr.deleted = '0' 
                    AND hr.estado_c = 'ER01'
                    AND GETDATE() BETWEEN DATEADD(hour, -4, hr.fecha_inicio_c) AND DATEADD(hour, -4, hr.fecha_fin_c)
                ) hr ON hr.id = hrac.hanrt_reglasenrutamiento_accountshanrt_reglasenrutamiento_ida AND hr.deleted ='0'
        LEFT JOIN hanrt_reglasenrutamiento_hanrt_tareasplan_c hrhtc ON hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_reglasenrutamiento_ida  = hr.id AND hrhtc.deleted ='0'
        LEFT JOIN (
                    SELECT *
                    FROM hanrt_tareasplan ht 
                    WHERE ht.deleted = '0' AND ht.estado_c = 'E01'
                ) ht ON ht.id = hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_tareasplan_idb AND ht.deleted ='0'
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hi2.tipo_visita_c AND hl.ListId = 'tipo_visita_c_list'
        LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = hr.estado_c AND hl1.ListId = 'hansa_estado_regla_enrutamiento_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = hr.tipo_regla_c AND hl2.ListId = 'hansa_tipo_regla_enrutamiento_list'
        LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = ht.estado_c AND hl3.ListId = 'hansa_estado_tarea_list'
        WHERE hp.id ='${idplanificador}' AND hi.deleted ='0'
        ORDER BY CAST(hi.secuencia_c AS INT) ASC
    `,
  Get_All_Hanrt_Planificaciones: `
        SELECT  hp.id as planificacion_id,
                hp.name as planificacion_name,
                hp.date_entered as planificacion_date_entered,
                hp.iddivision_c as planificacion_iddivision_c, hl5.Value as planificacion_division, 
                hp.idamercado_c as  planificacion_idamercado_c, hl6.Value as planificacion_amercado,
                hp.region_c as planificacion_region_c, hl7.Value as planificacion_region, 
                hp.tipo as planificacion_tipo, hl4.Value as planificacion_tipo_label,
                hp.estado_planificacion_c as planificacion_estado, hl8.Value as planificacion_estado_label,
                hp.assigned_user_id as planificacion_id_user,
                CONCAT(uhp.first_name,' ',uhp.last_name) as planificacion_user, 
                hi.id as group_id,
                hi.secuencia_c as group_secuencia_c,
                FORMAT(hi.fecha_plan_c, 'dd-MM-yyyy') as group_fecha_plan_c,
                u.id as group_user_id,
                u.first_name +' '+ u.last_name as group_usuario,
                hv.id as group_id_vehiculo,
                hv.name as group_placa,
                hi.capacidad_c as group_capacidad_c,
                FORMAT(DATEADD(hour, -4, hi.hora_inicio_c), 'HH:mm') as group_hora_inicio_c,
                FORMAT(DATEADD(hour, -4, hi.duracion_c), 'HH:mm') as group_duracion_c,
                FORMAT(DATEADD(hour, -4, hi.hora_fin_c), 'HH:mm') as group_hora_fin_c,
                hi2.id as ruta_id,
                hi2.secuencia_c as ruta_secuencia,
                hi2.name as ruta_name,
                hi2.tipo_visita_c as ruta_tipo_visita,
                hl.Value as ruta_tipo_visita_label,
                FORMAT(hi2.fecha_inicio_c, 'dd-MM-yyyy') as ruta_fecha_inicio_c,
                FORMAT(DATEADD(hour, -4, hi2.hora_inicio_c), 'HH:mm') as ruta_hora_inicio_c,
                FORMAT(DATEADD(hour, -4, hi2.duracion_c), 'HH:mm') as ruta_duracion_c,
                FORMAT(hi2.fecha_fin_c, 'dd-MM-yyyy') as ruta_fecha_fin_c,
                FORMAT(DATEADD(hour, -4, hi2.hora_fin_c), 'HH:mm') as ruta_hora_fin_c,
                a.id as ruta_id_account,
                ISNULL(
                    CASE 
                        WHEN ac.tipocuenta_c = 'Empresa' THEN a.name 
                        ELSE NULLIF(CONCAT(ac.names_c, ' ', ac.lastname_c), ' ')
                    END, NULL) as ruta_name_account,
                hi2.jjwg_maps_lat_c as ruta_latitud,
                hi2.jjwg_maps_lng_c as ruta_longitud,
                hi2.assigned_user_id as ruta_assigned_user_id,
                u2.first_name +' '+ u2.last_name as ruta_usuario_asignado,
                hr.id as regla_id,
                hr.name as regla_name,
                FORMAT(DATEADD(hour, -4, hr.fecha_inicio_c), 'dd-MM-yyyy HH:mm') as regla_fecha_inicio_c,
                FORMAT(DATEADD(hour, -4, hr.fecha_fin_c), 'dd-MM-yyyy HH:mm') as regla_fecha_fin_c,
                hr.estado_c as regla_estado_c, hl1.Value as regla_estado_label,
                hr.tipo_regla_c as regla_tipo_regla_c, hl2.Value as regla_tipo_regla_label,
                ht.id as tarea_id,
                ht.name as tarea_name,
                ht.estado_c as tarea_estado_c, hl3.Value as tarea_estado_c_label,
                ht.obligatorio_c as tarea_obligatorio_c
        FROM hanrt_planificador hp 
        LEFT JOIN users uhp ON hp.assigned_user_id = uhp.id 
        LEFT JOIN hanrt_planificador_hanrt_itemgroup_c hphic ON hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida = hp.id AND hphic.deleted='0'
        LEFT JOIN hanrt_itemgroup hi ON hi.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb AND hi.deleted ='0'
        LEFT JOIN users u ON u.id = hi.assigned_user_id AND u.deleted ='0'
        LEFT JOIN users_cstm uc ON uc.id_c = u.id
        LEFT JOIN hanrt_itemgroup_hans_vehiculos_c hihvc ON hihvc.hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb = hi.id AND hihvc.deleted ='0'
        LEFT JOIN hans_vehiculos hv ON hv.id = hihvc.hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida AND hv.deleted ='0'
        LEFT JOIN hanrt_itemgroup_hanrt_itemruta_c hihic ON hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida = hi.id AND hphic.deleted ='0'
        LEFT JOIn hanrt_itemruta hi2 ON hi2.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb AND hi2.deleted ='0'
        LEFT JOIN hanrt_itemruta_accounts_c hiac ON hiac.hanrt_itemruta_accountshanrt_itemruta_idb = hi2.id AND hiac.deleted='0'
        LEFT JOIN accounts a ON a.id = hiac.hanrt_itemruta_accountsaccounts_ida AND a.deleted ='0'
        LEFT JOIN accounts_cstm ac ON ac.id_c = a.id
        LEFT JOIN users u2 ON u2.id  = hi2.assigned_user_id AND u2.deleted ='0'
        LEFT JOIN hanrt_reglasenrutamiento_accounts_c hrac ON hrac.hanrt_reglasenrutamiento_accountsaccounts_idb  = a.id AND hrac.deleted ='0'
        LEFT JOIN (
              SELECT *
              FROM hanrt_reglasenrutamiento hr 
              WHERE hr.deleted = '0' 
                AND hr.estado_c = 'ER01'
                AND GETDATE() BETWEEN DATEADD(hour, -4, hr.fecha_inicio_c) AND DATEADD(hour, -4, hr.fecha_fin_c)
            ) hr ON hr.id = hrac.hanrt_reglasenrutamiento_accountshanrt_reglasenrutamiento_ida AND hr.deleted ='0'
        LEFT JOIN hanrt_reglasenrutamiento_hanrt_tareasplan_c hrhtc ON hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_reglasenrutamiento_ida  = hr.id AND hrhtc.deleted ='0'
        LEFT JOIN (
              SELECT *
              FROM hanrt_tareasplan ht 
              WHERE ht.deleted = '0' AND ht.estado_c = 'E01'
            ) ht ON ht.id = hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_tareasplan_idb AND ht.deleted ='0'
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hi2.tipo_visita_c AND hl.ListId = 'tipo_visita_c_list'
        LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = hr.estado_c AND hl1.ListId = 'hansa_estado_regla_enrutamiento_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = hr.tipo_regla_c AND hl2.ListId = 'hansa_tipo_regla_enrutamiento_list'
        LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = ht.estado_c AND hl3.ListId = 'hansa_estado_tarea_list'

        LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = hp.tipo  AND hl4.ListId = 'hansa_tipoplanificacion_list'
        LEFT JOIN pro.hansacrm_list hl5 WITH (NOLOCK) ON hl5.ID = hp.iddivision_c  AND hl5.ListId = 'hansa_divisiones_list'
        LEFT JOIN pro.hansacrm_list hl6 WITH (NOLOCK) ON hl6.ID = hp.idamercado_c  AND hl6.ListId = 'hansa_amercado_list'
        LEFT JOIN pro.hansacrm_list hl7 WITH (NOLOCK) ON hl7.ID = hp.region_c  AND hl7.ListId = 'hansa_dimregion_list'
        LEFT JOIN pro.hansacrm_list hl8 WITH (NOLOCK) ON hl8.ID = hp.estado_planificacion_c  AND hl8.ListId = 'estado_planificacion_c_list'
        WHERE hp.deleted ='0'
    `,
  Get_List_Planning_By_Filter: (condition: string) => `
        SELECT  hp.id as planificacion_id,
                hp.name as planificacion_name,
                hp.date_entered as planificacion_date_entered,
                hp.iddivision_c as planificacion_iddivision_c, hl5.Value as planificacion_division, 
                hp.idamercado_c as  planificacion_idamercado_c, hl6.Value as planificacion_amercado,
                hp.region_c as planificacion_region_c, hl7.Value as planificacion_region, 
                hp.tipo as planificacion_tipo, hl4.Value as planificacion_tipo_label,
                hp.estado_planificacion_c as planificacion_estado, hl8.Value as planificacion_estado_label,
                hp.assigned_user_id as planificacion_id_user,
                CONCAT(uhp.first_name,' ',uhp.last_name) as planificacion_user, 
                hi.id as group_id,
                hi.secuencia_c as group_secuencia_c,
                FORMAT(hi.fecha_plan_c, 'dd-MM-yyyy') as group_fecha_plan_c,
                u.id as group_user_id,
                u.first_name +' '+ u.last_name as group_usuario,
                hv.id as group_id_vehiculo,
                hv.name as group_placa,
                hi.capacidad_c as group_capacidad_c,
                FORMAT(DATEADD(hour, -4, hi.hora_inicio_c), 'HH:mm') as group_hora_inicio_c,
                FORMAT(DATEADD(hour, -4, hi.duracion_c), 'HH:mm') as group_duracion_c,
                FORMAT(DATEADD(hour, -4, hi.hora_fin_c), 'HH:mm') as group_hora_fin_c,
                hi2.id as ruta_id,
                hi2.secuencia_c as ruta_secuencia,
                hi2.name as ruta_name,
                hi2.tipo_visita_c as ruta_tipo_visita,
                hl.Value as ruta_tipo_visita_label,
                FORMAT(hi2.fecha_inicio_c, 'dd-MM-yyyy') as ruta_fecha_inicio_c,
                FORMAT(DATEADD(hour, -4, hi2.hora_inicio_c), 'HH:mm') as ruta_hora_inicio_c,
                FORMAT(DATEADD(hour, -4, hi2.duracion_c), 'HH:mm') as ruta_duracion_c,
                FORMAT(hi2.fecha_fin_c, 'dd-MM-yyyy') as ruta_fecha_fin_c,
                FORMAT(DATEADD(hour, -4, hi2.hora_fin_c), 'HH:mm') as ruta_hora_fin_c,
                a.id as ruta_id_account,
                ISNULL(
                    CASE 
                        WHEN ac.tipocuenta_c = 'Empresa' THEN a.name 
                        ELSE NULLIF(CONCAT(ac.names_c, ' ', ac.lastname_c), ' ')
                    END, NULL) as ruta_name_account,
                hi2.jjwg_maps_lat_c as ruta_latitud,
                hi2.jjwg_maps_lng_c as ruta_longitud,
                hi2.assigned_user_id as ruta_assigned_user_id,
                u2.first_name +' '+ u2.last_name as ruta_usuario_asignado,
                hr.id as regla_id,
                hr.name as regla_name,
                FORMAT(DATEADD(hour, -4, hr.fecha_inicio_c), 'dd-MM-yyyy HH:mm') as regla_fecha_inicio_c,
                FORMAT(DATEADD(hour, -4, hr.fecha_fin_c), 'dd-MM-yyyy HH:mm') as regla_fecha_fin_c,
                hr.estado_c as regla_estado_c, hl1.Value as regla_estado_label,
                hr.tipo_regla_c as regla_tipo_regla_c, hl2.Value as regla_tipo_regla_label,
                ht.id as tarea_id,
                ht.name as tarea_name,
                ht.estado_c as tarea_estado_c, hl3.Value as tarea_estado_c_label,
                ht.obligatorio_c as tarea_obligatorio_c
        FROM hanrt_planificador hp 
        LEFT JOIN users uhp ON hp.assigned_user_id = uhp.id 
        LEFT JOIN hanrt_planificador_hanrt_itemgroup_c hphic ON hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida = hp.id AND hphic.deleted='0'
        LEFT JOIN hanrt_itemgroup hi ON hi.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb AND hi.deleted ='0'
        LEFT JOIN users u ON u.id = hi.assigned_user_id AND u.deleted ='0'
        LEFT JOIN users_cstm uc ON uc.id_c = u.id
        LEFT JOIN hanrt_itemgroup_hans_vehiculos_c hihvc ON hihvc.hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb = hi.id AND hihvc.deleted ='0'
        LEFT JOIN hans_vehiculos hv ON hv.id = hihvc.hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida AND hv.deleted ='0'
        LEFT JOIN hanrt_itemgroup_hanrt_itemruta_c hihic ON hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida = hi.id AND hphic.deleted ='0'
        LEFT JOIn hanrt_itemruta hi2 ON hi2.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb AND hi2.deleted ='0'
        LEFT JOIN hanrt_itemruta_accounts_c hiac ON hiac.hanrt_itemruta_accountshanrt_itemruta_idb = hi2.id AND hiac.deleted='0'
        LEFT JOIN accounts a ON a.id = hiac.hanrt_itemruta_accountsaccounts_ida AND a.deleted ='0'
        LEFT JOIN accounts_cstm ac ON ac.id_c = a.id
        LEFT JOIN users u2 ON u2.id  = hi2.assigned_user_id AND u2.deleted ='0'
        LEFT JOIN hanrt_reglasenrutamiento_accounts_c hrac ON hrac.hanrt_reglasenrutamiento_accountsaccounts_idb  = a.id AND hrac.deleted ='0'
        LEFT JOIN (
              SELECT *
              FROM hanrt_reglasenrutamiento hr 
              WHERE hr.deleted = '0' 
                AND hr.estado_c = 'ER01'
                AND GETDATE() BETWEEN DATEADD(hour, -4, hr.fecha_inicio_c) AND DATEADD(hour, -4, hr.fecha_fin_c)
            ) hr ON hr.id = hrac.hanrt_reglasenrutamiento_accountshanrt_reglasenrutamiento_ida AND hr.deleted ='0'
        LEFT JOIN hanrt_reglasenrutamiento_hanrt_tareasplan_c hrhtc ON hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_reglasenrutamiento_ida  = hr.id AND hrhtc.deleted ='0'
        LEFT JOIN (
              SELECT *
              FROM hanrt_tareasplan ht 
              WHERE ht.deleted = '0' AND ht.estado_c = 'E01'
            ) ht ON ht.id = hrhtc.hanrt_reglasenrutamiento_hanrt_tareasplanhanrt_tareasplan_idb AND ht.deleted ='0'
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hi2.tipo_visita_c AND hl.ListId = 'tipo_visita_c_list'
        LEFT JOIN pro.hansacrm_list hl1 WITH (NOLOCK) ON hl1.ID = hr.estado_c AND hl1.ListId = 'hansa_estado_regla_enrutamiento_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = hr.tipo_regla_c AND hl2.ListId = 'hansa_tipo_regla_enrutamiento_list'
        LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = ht.estado_c AND hl3.ListId = 'hansa_estado_tarea_list'

        LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = hp.tipo  AND hl4.ListId = 'hansa_tipoplanificacion_list'
        LEFT JOIN pro.hansacrm_list hl5 WITH (NOLOCK) ON hl5.ID = hp.iddivision_c  AND hl5.ListId = 'hansa_divisiones_list'
        LEFT JOIN pro.hansacrm_list hl6 WITH (NOLOCK) ON hl6.ID = hp.idamercado_c  AND hl6.ListId = 'hansa_amercado_list'
        LEFT JOIN pro.hansacrm_list hl7 WITH (NOLOCK) ON hl7.ID = hp.region_c  AND hl7.ListId = 'hansa_dimregion_list'
        LEFT JOIN pro.hansacrm_list hl8 WITH (NOLOCK) ON hl8.ID = hp.estado_planificacion_c  AND hl8.ListId = 'estado_planificacion_c_list'
        WHERE hp.deleted ='0' ${condition}
        ORDER BY 
            CONVERT(DATETIME, 
            CONVERT(CHAR(11), hp.date_entered, 120) + ' 00:00:00', 120) DESC, 
        CASE
            WHEN hp.estado_planificacion_c = 'EP04' THEN 1
            WHEN hp.estado_planificacion_c = 'EP01' THEN 2
            WHEN hp.estado_planificacion_c = 'EP02' THEN 3
            WHEN hp.estado_planificacion_c = 'EP03' THEN 4
            ELSE 5
        END
        ASC
    `,
};
