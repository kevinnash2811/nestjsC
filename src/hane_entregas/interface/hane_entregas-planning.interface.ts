export interface IEntregaProductPlanningResult {
  entrega_id: string;
  entrega_name: string;
  entrega_fecha_entrega: string;
  entrega_iddivision: string;
  entrega_division: string;
  entrega_idamercado: string;
  entrega_amercado: string;
  entrega_idregional: string;
  entrega_regional: string;
  entrega_idestado: string;
  entrega_estado: string;
  entrega_ref1: string;
  entrega_ref2: string;
  entrega_nro_factura: string;
  product_name: string;
  product_description: string;
  product_part_number: string;
  product_item_description: string;
  product_secuencia: string;
  product_qty: number;
  product_list_price: number;
  product_discount: number;
  product_price_withdiscount: number;
  product_total_price: number;
}
