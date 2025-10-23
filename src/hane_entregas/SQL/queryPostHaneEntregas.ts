export const hane_entregas_post = {

    Post_Hane_Entregas_New:(item, current_user_id, iddivision_c?) =>`
        DECLARE @InsertedTable TABLE (id UNIQUEIDENTIFIER,
                                        name NVARCHAR(255),
                                        date_entered DATETIME,
                                        date_modified DATETIME,
                                        modified_user_id UNIQUEIDENTIFIER,
                                        created_by UNIQUEIDENTIFIER,
                                        deleted BIT,
                                        assigned_user_id UNIQUEIDENTIFIER,
                                        iddivision_c NVARCHAR(255),
                                        idamercado_c NVARCHAR(255),
                                        fecha_entrega_c DATETIME,
                                        regional_c NVARCHAR(255),
                                        estado_c NVARCHAR(255),
                                        ubicacion_c NVARCHAR(255),
                                        lugar_entrega_c NVARCHAR(255),
                                        referencia_c NVARCHAR(255),
                                        unidades_entregadas_c INT,
                                        id_tenant UNIQUEIDENTIFIER,
                                        condicion_pago_c NVARCHAR(255),
                                        nro_factura_c NVARCHAR(255),
                                        referencia2_c NVARCHAR(255),
                                        clase_entrega_c NVARCHAR(255));

        INSERT INTO dbo.hane_entregas
        (id, name, date_entered, date_modified, modified_user_id, created_by, deleted, assigned_user_id, iddivision_c, idamercado_c, fecha_entrega_c, regional_c, estado_c, ubicacion_c, lugar_entrega_c, referencia_c, unidades_entregadas_c, id_tenant, condicion_pago_c, nro_factura_c, referencia2_c,clase_entrega_c)
        OUTPUT 
            inserted.id,
            inserted.name,
            inserted.date_entered,
            inserted.date_modified,
            inserted.modified_user_id,
            inserted.created_by,
            inserted.deleted,
            inserted.assigned_user_id,
            inserted.iddivision_c,
            inserted.idamercado_c,
            inserted.fecha_entrega_c,
            inserted.regional_c,
            inserted.estado_c,
            inserted.ubicacion_c,
            inserted.lugar_entrega_c,
            inserted.referencia_c,
            inserted.unidades_entregadas_c,
            inserted.id_tenant,
            inserted.condicion_pago_c,
            inserted.nro_factura_c,
            inserted.referencia2_c,
            inserted.clase_entrega_c
        INTO @InsertedTable
        VALUES(NEWID(), '${item.entrega}', DATEADD(hour, 4, GETDATE()), DATEADD(hour, 4, GETDATE()), '${current_user_id}', '${current_user_id}', '0', '${current_user_id}', '${item.ofvt?item.ofvt:'BO10'}', 'BO10_${item.sector}', '${item.fechaEntrega}', '${item.ofvt}_${item.ofvt.substr(-2)}', '03', 'ZV', '${item.calle?item.calle:''}', '${item.factura}', '${item.cantidad}', '23878c0b-bfbe-948e-a2bc-663d100ea7de','${item.condpago}', '${item.nfiscal}', '${item.npedido}','${item.clase}');

        SELECT * FROM @InsertedTable;
    `,

    Post_Aos_Product_Quotes_New:(item, producto, resultados_material, current_user_id, iddivision_c)=>`

        DECLARE @newId UNIQUEIDENTIFIER;
        SET @newId = NEWID();

        INSERT INTO dbo.aos_products_quotes
        (id, name, date_entered, date_modified, modified_user_id, created_by, description, deleted, assigned_user_id, currency_id, part_number, item_description, number, product_qty, product_cost_price, product_cost_price_usdollar, product_list_price, product_list_price_usdollar, product_discount, product_discount_usdollar, product_discount_amount, product_discount_amount_usdollar, discount, product_unit_price, product_unit_price_usdollar, vat_amt, vat_amt_usdollar, product_total_price, product_total_price_usdollar, vat, parent_type, parent_id, product_id, group_id, product_procedencia, product_delivery_time, product_confirmed_c, is_invoices_c, valor_fob, valor_fob_usdollar, nombre_orden_compra_c, id_orden_compra_c, hito_embarque_c, estado_embarque_c, fecha_prevista_entrega_c, id_tenant)
        VALUES(@newId, '${producto.name}', DATEADD(hour, 4, GETDATE()), DATEADD(hour, 4, GETDATE()), '${current_user_id}', '${current_user_id}', '', '0', '${current_user_id}', 'e8fdff2e-5959-3879-dece-66a2295ac1a7', '', '${producto.name?producto.name:''}', '${producto.number}', '${producto.cantidad?producto.cantidad:'0'}', 0, 0, 0, 0, 0, 0, 0, 0, N'Percentage', 0, 0, 0, 0, 0, 0, '5.0', 'HANE_Entregas', '${item.id}', '${resultados_material.id}', '', '${item.material?item.material:''}', 'inmediate', '1', '0', 0, 0, '', '', '', '', '${item.fechaEntrega}', '23878c0b-bfbe-948e-a2bc-663d100ea7de');

        INSERT INTO dbo.aos_products_quotes_cstm
        (id_c, product_flag_chasis_c, other_c, hanp_proveedores_id_c, plantillatarea_c, repuestos_c, entrega_parent_id_c, entrega_parent_type_c, entrega_cantidad_c, product_parent_type_c, product_descripcion_c, product_caracteristica_c, product_atributos_c, imagen_principal_c, unidad_medida_c, fecha_traslado, nro_entrega_c, entregado_c)
        VALUES(@newId, '0', '', '', '', '', '', '', '0', 'HANI_ItemStock', '', '', '${producto.garticulos?producto.garticulos:''}', '', '${producto.unmedida?producto.unmedida:''}', '', '${item.entrega?item.entrega:''}', '0');
    
    `,

    Post_Aos_Product_Quotes_New_No_Product:(item, producto, resultados_material, current_user_id, iddivision_c)=>`
        DECLARE @newId UNIQUEIDENTIFIER;
        SET @newId = NEWID();

        INSERT INTO dbo.aos_products_quotes
        (id, name, date_entered, date_modified, modified_user_id, created_by, description, deleted, assigned_user_id, currency_id, part_number, item_description, number, product_qty, product_cost_price, product_cost_price_usdollar, product_list_price, product_list_price_usdollar, product_discount, product_discount_usdollar, product_discount_amount, product_discount_amount_usdollar, discount, product_unit_price, product_unit_price_usdollar, vat_amt, vat_amt_usdollar, product_total_price, product_total_price_usdollar, vat, parent_type, parent_id, product_id, group_id, product_procedencia, product_delivery_time, product_confirmed_c, is_invoices_c, valor_fob, valor_fob_usdollar, nombre_orden_compra_c, id_orden_compra_c, hito_embarque_c, estado_embarque_c, fecha_prevista_entrega_c, id_tenant)
        VALUES(@newId, '${producto.name}', DATEADD(hour, 4, GETDATE()), DATEADD(hour, 4, GETDATE()), '${current_user_id}', '${current_user_id}', '', '0', '${current_user_id}', 'e8fdff2e-5959-3879-dece-66a2295ac1a7', '', '${producto.name?producto.name:''}', '${producto.number}', '${producto.cantidad?producto.cantidad:'0'}', 0, 0, 0, 0, 0, 0, 0, 0, N'Percentage', 0, 0, 0, 0, 0, 0, '5.0', 'HANE_Entregas', '${item.id}', '', '', '${item.material}', 'inmediate', '1', '0', 0, 0, '', '', '', '', '${item.fechaEntrega}', '23878c0b-bfbe-948e-a2bc-663d100ea7de');

        INSERT INTO dbo.aos_products_quotes_cstm
        (id_c, product_flag_chasis_c, other_c, hanp_proveedores_id_c, plantillatarea_c, repuestos_c, entrega_parent_id_c, entrega_parent_type_c, entrega_cantidad_c, product_parent_type_c, product_descripcion_c, product_caracteristica_c, product_atributos_c, imagen_principal_c, unidad_medida_c, fecha_traslado, nro_entrega_c, entregado_c)
        VALUES(@newId, '0', '', '', '', '', '', '', '0', 'HANI_ItemNoStock', '', '', '${producto.garticulos?producto.garticulos:''}', '', '${producto.unmedida?producto.unmedida:''}', '', '${item.entrega}', '0');
    
    `,

    Post_Hane_Entregas_Accounts:(idAccount, idHaneEntrega)=>`
        INSERT INTO hane_entregas_accounts_c (id, hane_entregas_accountsaccounts_ida, hane_entregas_accountshane_entregas_idb) 
        VALUES (NEWID(), '${idAccount}', '${idHaneEntrega}')
    `
};