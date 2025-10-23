import { HanrtItemrutaEntity } from "../entities"

export type RouteToCreate = {
  route: HanrtItemrutaEntity,
  accountId: string;
  contactId?: string;
  routeTasks: string[];
  routeDeliveries: string[];
}

export type RouteToUpdate = {
  route: Partial<HanrtItemrutaEntity> & { id: string } | HanrtItemrutaEntity;
  accountId?: string;
  contactId?: string;
  routeTasks: string[];
  routeDeliveries: string[];
}

export type VisitUpdateOrder = {
  id: string;
  secuencia: number;
  userId?: string;
  duracion: string;
  horaInicio: string;
  horaFin: string;
}