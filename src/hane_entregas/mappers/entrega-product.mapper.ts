import { toUTC4 } from "src/helpers";
import { AosProductoEntregaDto, EntregaPlanningDto } from "../dto";
import { IEntregaProductPlanningResult } from "../interface";

export const mapProductEntregaToProductDto = (product: IEntregaProductPlanningResult): AosProductoEntregaDto => {
  return {
    cantidad: Number(product.product_qty || 0),
    conDescuento: Number(product.product_price_withdiscount || 0),
    descripcion: product.product_description,
    descuento: Number(product.product_discount || 0),
    itemDescripcion: product.product_item_description,
    nombre: product.product_name,
    partNumber: product.product_part_number,
    precio: Number(product.product_list_price || 0),
    secuencia: Number(product.product_secuencia || 0),
    total: Number(product.product_total_price || 0),
  }
}

export const mapEntregaResultToEntregaDto = (entrega: IEntregaProductPlanningResult): EntregaPlanningDto => {
  return {
    id: entrega.entrega_id,
    amercado: entrega.entrega_amercado,
    idAmercado: entrega.entrega_idamercado,
    division: entrega.entrega_division,
    idDivision: entrega.entrega_iddivision,
    estado: entrega.entrega_estado,
    idEstado: entrega.entrega_idestado,
    fechaEntrega: entrega.entrega_fecha_entrega,
    regional: entrega.entrega_regional,
    idRegional: entrega.entrega_idregional,
    name: entrega.entrega_name,
    nroFactura: entrega.entrega_nro_factura,
    referencia: entrega.entrega_ref1,
    referencia2: entrega.entrega_ref2,
    products: [],
  }
}