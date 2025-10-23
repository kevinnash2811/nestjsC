import { CreateRouteQueryDto } from "../dto"
import { ItemRutaRawToCreate } from "../interfaces"
import { RouteToCreate } from "../types"

export const CreateRouteQueryToEntity = (ruta: CreateRouteQueryDto): RouteToCreate => {
  return {
    route: {
      id: crypto.randomUUID(),
      date_entered: new Date(),
      date_modified: new Date(),
      deleted: 0,
      created_by: ruta.userId,
      assigned_user_id: ruta.userId,
      duracion_c: new Date(ruta.duracion),
      description: ruta.description,
      fecha_fin_c: new Date(ruta.fechaFin),
      fecha_inicio_c: new Date(ruta.fechaInicio),
      hora_fin_c: new Date(ruta.horaFin),
      hora_inicio_c: new Date(ruta.horaInicio),
      tipo_visita_c: ruta.tipoVisita,
      modified_user_id: ruta.userId,
      name: ruta.name,
      secuencia_c: ruta.secuencia,
      jjwg_maps_lat_c: ruta.latitud,
      jjwg_maps_lng_c: ruta.longitud,
      tipo_visita_hbm_c: ruta.tipoVisitaHbm,
    },
    accountId: ruta.idAccount,
    contactId: ruta.idContact,
    routeDeliveries: ruta.entregasList ?? [],
    routeTasks: ruta.tareasPlan ?? [],
  }
}

export const CreateRoutesQueryToEntities = (rutas: CreateRouteQueryDto[]): RouteToCreate[] => {
  return rutas.map(CreateRouteQueryToEntity);
}

export const DbQueryToCreateRoute = (raw: ItemRutaRawToCreate): CreateRouteQueryDto => {
  return {
    name: raw.name,
    description: raw.description,
    tipoVisita: raw.tipo_visita_c,
    tipoVisitaHbm: raw.tipo_visita_hbm_c,
    fechaInicio: raw.fecha_inicio_c,
    duracion: raw.duracion_c,
    fechaFin: raw.fecha_fin_c,
    horaFin: raw.hora_fin_c,
    horaInicio: raw.hora_inicio_c,
    idAccount: raw.accountId ?? undefined,
    idContact: raw.contactId ?? undefined,
    secuencia: Number(raw.secuencia_c) ?? 1,
    userId: raw.assigned_user_id,
    latitud: raw.jjwg_maps_lat_c ?? undefined,
    longitud: raw.jjwg_maps_lng_c ?? undefined,
    entregasList: raw.entregaIds ? raw.entregaIds.split(',') : [],
    tareasPlan: raw.tareaIds ? raw.tareaIds.split(',') : [],
  }
}