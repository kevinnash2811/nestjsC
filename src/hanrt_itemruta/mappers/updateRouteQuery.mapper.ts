import { UpdateRouteQueryDto } from "../dto"
import { RouteToUpdate } from "../types"
import { HanrtItemrutaEntity } from "../entities";

export const UpdateRouteQueryToEntity = (route: UpdateRouteQueryDto): RouteToUpdate => {
  const routeRes: Partial<HanrtItemrutaEntity> & { id: string } | HanrtItemrutaEntity = {
    id: route.id,
    date_modified: new Date(),
    deleted: 0,
  };

  if (route.name) routeRes.name = route.name;
  if (route.description) routeRes.description = route.description;
  if (route.duracion) routeRes.duracion_c = new Date(route.duracion);
  if (route.fechaFin) routeRes.fecha_fin_c = new Date(route.fechaFin);
  if (route.fechaInicio) routeRes.fecha_inicio_c = new Date(route.fechaInicio);
  if (route.horaFin) routeRes.hora_fin_c = new Date(route.horaFin);
  if (route.horaInicio) routeRes.hora_inicio_c = new Date(route.horaInicio);
  if (route.latitud) routeRes.jjwg_maps_lat_c = route.latitud;
  if (route.longitud) routeRes.jjwg_maps_lng_c = route.longitud;
  if (route.secuencia) routeRes.secuencia_c = route.secuencia;
  if (route.tipoVisita) routeRes.tipo_visita_c = route.tipoVisita;
  if (route.tipoVisitaHbm) routeRes.tipo_visita_hbm_c = route.tipoVisitaHbm;
  if (route.userId) routeRes.modified_user_id = route.userId;


  return {
    route: routeRes,
    accountId: route.idAccount,
    contactId: route.idContact,
    routeDeliveries: route.entregasList ?? [],
    routeTasks: route.tareasPlan ?? [], 
  }
}


export const UpdateRoutesQueryToEntities = (routes: UpdateRouteQueryDto[]): RouteToUpdate[] => {
  return routes.map(UpdateRouteQueryToEntity);
}
