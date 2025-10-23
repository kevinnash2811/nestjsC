import { AccountPlanningDto } from "../dto";
import { AccountRawPlanning } from "../interface";

export const mapAccountRawToAccountPlanningDto = (
  raw: AccountRawPlanning,
): AccountPlanningDto => {
  return {
    id: raw.id,
    accountName: raw.account_name,
    billingCity: raw.billing_address_city,
    billingStreet: raw.billing_address_street,
    categoriaVentas: raw.categoria_ventas_c,
    categoriaVentas2: raw.categoria_ventas02_c,
    location: {
      lat: raw.jjwg_maps_lat_c,
      lng: raw.jjwg_maps_lng_c,
    },
    zonaTransporte: raw.zona_transporte_c,
    zone: raw.zone,
    zoneId: raw.zoneId,
  };
};
