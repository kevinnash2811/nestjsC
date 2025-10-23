export const accounts = {
    Get_All_Accounts: `
        SELECT  a.id, CASE WHEN ac.tipocuenta_c='Empresa' THEN  a.name ELSE CONCAT(ac.names_c , ' ', ac.lastname_c) END as name, 
            a.billing_address_street as address, 
            ac.jjwg_maps_lat_c AS lat,
            ac.jjwg_maps_lng_c AS lng, 
            ac.categoria_ventas_c as category
        FROM accounts a 
        LEFT JOIN accounts_cstm ac ON ac.id_c = a.id
        WHERE a.deleted = '0' AND ac.jjwg_maps_lat_c != 0 AND ac.jjwg_maps_lng_c != 0
    `,
    Get_All_Accounts_User: (iduser: string) => `
        SELECT DISTINCT a.id, CASE WHEN ac.tipocuenta_c='Empresa' THEN  a.name ELSE CONCAT(ac.names_c , ' ', ac.lastname_c) END as name, 
            a.billing_address_street AS address, 
            ac.jjwg_maps_lat_c AS lat,
            ac.jjwg_maps_lng_c AS lng,
            ac.categoria_ventas_c AS category
        FROM accounts a 
        LEFT JOIN accounts_cstm ac ON ac.id_c = a.id
        INNER JOIN hana_relaciones_accounts_c hrac ON hrac.hana_relaciones_accountsaccounts_ida = a.id AND hrac.deleted = 0
        INNER JOIN hana_relaciones hr ON hr.id = hrac.hana_relaciones_accountshana_relaciones_idb AND hr.deleted = 0
        INNER JOIN hanit_interlocutores_hana_relaciones_c hihrc ON hihrc.hanit_interlocutores_hana_relacioneshana_relaciones_ida = hr.id AND hihrc.deleted = 0
        INNER JOIN hanit_interlocutores hi ON hi.id = hihrc.hanit_interlocutores_hana_relacioneshanit_interlocutores_idb AND hi.deleted = 0
        WHERE 
            a.deleted = '0' 
        AND ac.jjwg_maps_lat_c != 0 
        AND ac.jjwg_maps_lng_c != 0 
        AND hi.assigned_user_id = '${iduser}'
    `,
    Get_Account_Id: (idaccount: string) => `
        SELECT 
            a.id,
            CASE 
                WHEN ac.tipocuenta_c='Empresa' THEN  a.name 
                ELSE CONCAT(ac.names_c , ' ', ac.lastname_c) 
            END as nombre,
            ac.nit_ci_c,
            a.industry,
            hl.value as industry_name,
            ac.subindustry_c,
            hl2.value as subindustry,
            a.shipping_address_city AS ciudad,
            a.billing_address_state AS departamento,
            a.billing_address_country AS pais,
            a.phone_office,
            a.phone_alternate,
            eaa.email_address,
            a.billing_address_street,
            ac.jjwg_maps_lat_c,
            ac.jjwg_maps_lng_c
        FROM accounts a 
        LEFT JOIN accounts_cstm ac ON ac.id_c = a.id
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = a.industry  AND hl.ListId = 'hansa_dimrubro_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = ac.subindustry_c  AND hl2.ListId = 'hansa_dimsubrubro_list'
        LEFT JOIN email_addr_bean_rel ea WITH (NOLOCK) ON ea.bean_id = a.id AND ea.deleted = 0 AND ea.primary_address = 1
        LEFT JOIN email_addresses eaa WITH (NOLOCK) ON eaa.id = ea.email_address_id AND eaa.deleted = 0 
        WHERE a.deleted ='0' AND a.id ='${idaccount}'
    `,
    Get_Canal_Ventas: (idAccount: string) => `
        SELECT hl.Value as division, hl2.Value as amercado, hl3.Value as regional, hl4.Value as canal_ventas
        FROM hana_relaciones hr
        LEFT JOIN hana_relaciones_accounts_c hrac ON hrac.hana_relaciones_accountshana_relaciones_idb = hr.id AND hrac.deleted ='0'
        LEFT JOIN accounts a ON a.id = hrac.hana_relaciones_accountsaccounts_ida AND a.deleted ='0'
        LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hr.iddivision_c  AND hl.ListId = 'hansa_divisiones_list'
        LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = hr.idamercado_c  AND hl2.ListId = 'hansa_amercado_list'
        LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = hr.idregional_c  AND hl3.ListId = 'hansa_dimregional_list'
        LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = hr.idcanalvta_c  AND hl4.ListId = 'hansa_dimcanal_list'
        WHERE a.id ='${idAccount}' AND a.deleted ='0'
    `,
    Get_Preferencia_Visita: (idAccount: string, tipoVisita: string) => `
           	SELECT 
                STUFF((
                    SELECT 
                        ' - ' + 
                        CASE 
                            -- Asegurarse de que dayofweek_c no sea NULL ni vacío
                            WHEN hv.dayofweek_c IS NOT NULL AND LTRIM(RTRIM(hv.dayofweek_c)) <> '' THEN hl.Value
                            -- Asegurarse de que dayofmonth_c no sea NULL ni vacío
                            WHEN hv.dayofmonth_c IS NOT NULL AND LTRIM(RTRIM(hv.dayofmonth_c)) <> '0' THEN 'Día ' + CAST(hv.dayofmonth_c AS VARCHAR)
                            -- Asegurarse de que weekofmonth_c no sea NULL
                            WHEN hv.weekofmonth_c IS NOT NULL THEN 'Semana ' + CAST(hv.weekofmonth_c AS VARCHAR)
                            ELSE 'Custom'
                        END
                    FROM hanrt_visitasdiarias_hanrt_preferenciavisita_c hvhpc
                    LEFT JOIN hanrt_visitasdiarias hv ON hv.id = hvhpc.hanrt_visitasdiarias_hanrt_preferenciavisitahanrt_visitasdiarias_idb 
                    LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = hv.dayofweek_c AND hl.ListId = 'dayofweek_c_list'
                    WHERE hvhpc.hanrt_visitasdiarias_hanrt_preferenciavisitahanrt_preferenciavisita_ida = hp.id AND hvhpc.deleted = '0' AND hv.deleted = '0' AND hv.activo_c ='01'
                    -- Ordenar por el valor de los días de la semana
                    ORDER BY 
                        CASE 
                            WHEN LTRIM(RTRIM(hv.dayofweek_c)) = 'Monday' THEN 1
                            WHEN LTRIM(RTRIM(hv.dayofweek_c)) = 'Tuesday' THEN 2
                            WHEN LTRIM(RTRIM(hv.dayofweek_c)) = 'Wednesday' THEN 3
                            WHEN LTRIM(RTRIM(hv.dayofweek_c)) = 'Thursday' THEN 4
                            WHEN LTRIM(RTRIM(hv.dayofweek_c)) = 'Friday' THEN 5
                            WHEN LTRIM(RTRIM(hv.dayofweek_c)) = 'Saturday' THEN 6
                            WHEN LTRIM(RTRIM(hv.dayofweek_c)) = 'Sunday' THEN 7
                            ELSE 8
                        END
                    FOR XML PATH(''), TYPE
                ).value('.', 'NVARCHAR(MAX)'), 1, 3, '') AS Days,
                

                FORMAT(DATEADD(HOUR, -4, hp.starttimes_c), 'HH:mm') AS StartTime,
                FORMAT(DATEADD(HOUR, -4, hp.endtime_c), 'HH:mm') AS EndTime,
                
                CASE 
                    WHEN hp.tipo_c = 'daily' THEN 'Cada día'
                    WHEN hp.tipo_c = 'weekly' THEN 'Cada semana'
                    WHEN hp.tipo_c = 'monthly' THEN 'Cada ' + CAST(hp.interval_c AS VARCHAR) + ' mes(es)'
                    ELSE NULL
                END AS Frequency

            FROM accounts a 
            INNER JOIN hanrt_preferenciavisita_accounts_c hpac ON hpac.hanrt_preferenciavisita_accountsaccounts_ida = a.id AND hpac.deleted ='0'
            LEFT JOIN hanrt_preferenciavisita hp ON hp.id = hpac.hanrt_preferenciavisita_accountshanrt_preferenciavisita_idb AND hp.deleted ='0'
            LEFT JOIN hanrt_visitasdiarias_hanrt_preferenciavisita_c hvhpc ON hvhpc.hanrt_visitasdiarias_hanrt_preferenciavisitahanrt_preferenciavisita_ida = hp.id AND hvhpc.deleted ='0'
            LEFT JOIN hanrt_visitasdiarias hv ON hv.id = hvhpc.hanrt_visitasdiarias_hanrt_preferenciavisitahanrt_visitasdiarias_idb AND hv.deleted ='0'
            WHERE a.id = '${idAccount}' AND a.deleted='0' AND hp.activo_c ='01' AND hp.tipo_preferencia_c ='${tipoVisita}'
            GROUP BY hp.id, hp.starttimes_c, hp.endtime_c, hp.tipo_c, hp.interval_c;

    `,
    Get_UsersReports_To:(idUser: string) =>`
        SELECT u.id
        FROM users u 
        LEFT JOIN users_cstm uc ON uc.id_c  = u.id	
        WHERE u.reports_to_id ='${idUser}' AND u.deleted ='0' 
    `
}