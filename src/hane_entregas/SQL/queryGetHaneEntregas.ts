export const hane_entregas = {
    Get_All_Hane_Entregas_User: (iduser:string) => {
        // Construir la subconsulta condicionalmente
        const userCondition = iduser ? `
            AND a.id IN (
                SELECT hra.hana_relaciones_accountsaccounts_ida
                FROM hana_relaciones_accounts_c hra
                LEFT JOIN hana_relaciones hr ON hr.id = hra.hana_relaciones_accountshana_relaciones_idb
                WHERE hra.deleted = '0' AND hr.deleted = '0' AND hr.assigned_user_id='${iduser}'
            )
        ` : '';

        // Construir la consulta principal
        return `
            SELECT 
                a.id, 
                CASE 
                    WHEN ac.tipocuenta_c = 'Empresa' THEN a.name 
                    ELSE CONCAT(ac.names_c, ' ', ac.lastname_c) 
                END as name,
                a.billing_address_street as address, 
                ac.jjwg_maps_lat_c as lat,
                ac.jjwg_maps_lng_c as lng,
                ac.categoria_ventas_c as category,
                COUNT(he.estado_c) as entregas_pendientes
            FROM accounts a 
            LEFT JOIN accounts_cstm ac ON ac.id_c = a.id
            LEFT JOIN hane_entregas_accounts_c heac ON heac.hane_entregas_accountsaccounts_ida = a.id AND heac.deleted = '0'
            LEFT JOIN hane_entregas he ON he.id = heac.hane_entregas_accountshane_entregas_idb AND he.deleted = '0'
            WHERE 
                a.deleted = '0' 
                AND ac.jjwg_maps_lat_c != 0 
                AND ac.jjwg_maps_lng_c != 0 
                AND he.estado_c = '03'
                ${userCondition}  -- Incluir la condición del usuario si aplica
            GROUP BY 
                a.id, 
                CASE 
                    WHEN ac.tipocuenta_c = 'Empresa' THEN a.name 
                    ELSE CONCAT(ac.names_c, ' ', ac.lastname_c) 
                END,
                a.billing_address_street, 
                ac.jjwg_maps_lat_c, 
                ac.jjwg_maps_lng_c,
                ac.categoria_ventas_c;
        `;
    },
    Get_Entregas_Account:(idaccount:string, estado:string, from: string | null, to: string | null) => {
        let fechas = '';
        if(from && to)
            fechas = `AND he.fecha_entrega_c BETWEEN '${from}' AND '${to}'`;
        else if (from)
            fechas = `AND he.fecha_entrega_c >= '${from}'`;
        else if (to)
            fechas = `AND he.fecha_entrega_c <= '${to}'`;
        return `
           SELECT  he.id, 
		        he.name, 
		        he.iddivision_c, hl.Value as division, 
		        he.idamercado_c, hl2.Value as amercado, 
		        he.estado_c, 
                he.fecha_entrega_c as fecha_entrega,
		        hl3.Value as estado,
		        (
					  SELECT ai.name as factura_name_aio,
								ai.number as factura_number,
								ai.description as factura_descripcion,
								ai.billing_address_street as factura_direccion,
								ai.status as factura_status, 
								hl01.Value as factura_estatus_label,
								(
									SELECT 	apq.name as product_name, 
											apq.description as product_nota_description, 
											apq.part_number as product_part_number,
											apq.item_description as product_item_description,
											apq.number as product_secuencia,
											CAST(apq.product_qty AS INT) as product_cantidad,
											FORMAT(apq.product_list_price, 'N2') as product_precio,
											FORMAT(apq.product_discount, 'N2') as product_descuento,
											FORMAT(apq.product_unit_price, 'N2') as product_condescuento,
											FORMAT(apq.product_total_price, 'N2') as product_total
									FROM aos_products_quotes apq
									WHERE apq.parent_id = ai.id
									FOR JSON PATH
								) as json_products
						 FROM aos_invoices ai 
					 LEFT JOIN hane_entregas_aos_invoices_c heaic ON heaic.hane_entregas_aos_invoicesaos_invoices_idb = ai.id AND heaic.deleted =0
					 LEFT JOIN pro.hansacrm_list hl01 WITH (NOLOCK) ON hl01.ID = ai.status  AND hl01.ListId = 'invoice_status_dom'
					 WHERE heaic.hane_entregas_aos_invoiceshane_entregas_ida = he.id AND ai.deleted =0
					 FOR JSON PATH
				) as facturas_product,
				(
                    SELECT 
                        apq.*, 
                        hq.codigoaio_c,
                        hq.iddivision_c,
                        hq.nombre_familia_c,
                        hl2.Value as mercado
                    FROM aos_products_quotes apq 
                    LEFT JOIN aos_products ap ON ap.id = apq.product_id 
                    LEFT JOIN hanq_modelo_aos_products_c hmapc ON hmapc.hanq_modelo_aos_productsaos_products_idb = ap.id
                    LEFT JOIN hanq_modelo hq ON hq.id = hmapc.hanq_modelo_aos_productshanq_modelo_ida
                    LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = he.idamercado_c  AND hl2.ListId = 'hansa_amercado_list'
                    WHERE apq.parent_id = he.id 
                    AND apq.deleted = 0
                    FOR JSON PATH
                ) AS entregas_product

			FROM hane_entregas he 
			LEFT JOIN hane_entregas_accounts_c heac ON heac.hane_entregas_accountshane_entregas_idb  = he.id AND heac.deleted ='0'
			LEFT JOIN accounts a ON a.id = heac.hane_entregas_accountsaccounts_ida AND a.deleted ='0'
			LEFT JOIN accounts_cstm ac ON ac.id_c = a.id 
			LEFT JOIN pro.hansacrm_list hl WITH (NOLOCK) ON hl.ID = he.iddivision_c  AND hl.ListId = 'hansa_divisiones_list'
			LEFT JOIN pro.hansacrm_list hl2 WITH (NOLOCK) ON hl2.ID = he.idamercado_c  AND hl2.ListId = 'hansa_amercado_list'
			LEFT JOIN pro.hansacrm_list hl3 WITH (NOLOCK) ON hl3.ID = he.estado_c  AND hl3.ListId = 'hane_estado_list'
			WHERE he.deleted ='0' AND he.estado_c ='${estado}' AND a.id='${idaccount}' ${fechas} 
    `
    },

    Get_Hane_Entregas_By_Name:(entregas) =>`
        SELECT * FROM dbo.hane_entregas he WHERE he.name IN (${entregas.map(entrega => `'${entrega}'`).join(', ')}) AND he.deleted ='0'
    `,

    Get_Products_By_Material:(materiales) =>`
        WITH UniqueProducts AS (
            SELECT 
                ap.maincode, 
                ap.name, 
                ap.id,
                ROW_NUMBER() OVER (PARTITION BY ap.maincode ORDER BY ap.id) AS rn
            FROM aos_products ap
            WHERE ap.maincode IN (${materiales.map(material => `'${material}'`).join(', ')})
        )
        SELECT maincode, name, id
        FROM UniqueProducts
        WHERE rn = 1;
    `,

    Get_Products_By_MainCode:(maincode) =>`
        WITH UniqueProducts AS (
            SELECT 
                ap.maincode, 
                ap.name, 
                ap.id,
                ROW_NUMBER() OVER (PARTITION BY ap.maincode ORDER BY ap.id) AS rn
            FROM aos_products ap
            WHERE ap.maincode = '${maincode}' AND ap.deleted='0'
        )
        SELECT maincode, name, id
        FROM UniqueProducts
        WHERE rn = 1 ;
    `,
    Get_Aos_Products_Quotes_By_Id:(name, parent_id)=>`
        SELECT CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM aos_products_quotes apq 
                WHERE apq.name = '${name}' 
                AND apq.parent_id = '${parent_id}' 
                AND apq.deleted = '0'
            ) THEN CAST(1 AS BIT)
            ELSE CAST(0 AS BIT)
        END AS existsFlag
    `,
    Get_Accounts_By_Sic_Code:(sic_code:string)=>`
        WITH UniqueProducts AS (
            SELECT 
                a.id, 
                a.name, 
                ROW_NUMBER() OVER (PARTITION BY a.name ORDER BY a.id) AS rn
            FROM accounts a 
			WHERE a.sic_code ='${sic_code}' AND a.deleted ='0'
        )
        SELECT id, name
        FROM UniqueProducts
        WHERE rn = 1 ;
    `,
    Get_Hane_Entregas_Accounts:(idcuenta:string, identrega:string)=>`
        SELECT CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM hane_entregas_accounts_c heac
                WHERE heac.hane_entregas_accountshane_entregas_idb = '${identrega}' 
                AND heac.hane_entregas_accountsaccounts_ida = '${idcuenta}'
                AND heac.deleted = '0'
            ) THEN CAST(1 AS BIT)
            ELSE CAST(0 AS BIT)
        END AS existsFlag
    `
};