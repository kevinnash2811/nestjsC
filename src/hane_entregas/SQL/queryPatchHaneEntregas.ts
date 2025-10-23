export const hane_entregas_patch = {

    Patch_Hane_Entregas_Update:(item, current_user_id, iddivision_c) =>`
        UPDATE dbo.hane_entregas
        SET date_modified=DATEADD(hour, 4, GETDATE()), modified_user_id='${current_user_id}', lugar_entrega_c='${item.calle?item.calle:''}', fecha_entrega_c='${item.fechaEntrega}', regional_c='${item.ofvt}_${item.ofvt.substr(-2)}', unidades_entregadas_c='${item.cantidad}', referencia2_c='${item.npedido}', nro_factura_c='${item.nfiscal}', condicion_pago_c='${item.condpago}',clase_entrega_c='${item.clase}'
        WHERE id='${item.id}';
    `,

    //Patch_Aos_Product_Quotes_Update
};