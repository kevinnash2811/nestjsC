import moment from 'moment';
import { ItemGroupDto } from '../dto';
import { GroupDBResult } from '../interface';
import { toUTC4 } from 'src/helpers';

export const mapDbResultToGroupDto = (
  sqlResult: GroupDBResult,
): ItemGroupDto => {
  return {
    id: sqlResult.id,
    createdAt: toUTC4(sqlResult.date_entered),
    name: sqlResult.name,
    description: sqlResult.description,
    assignedUserId: sqlResult.assigned_user_id,
    fechaPlan: toUTC4(sqlResult.fecha_plan_c),
    capacidad: Number(sqlResult.capacidad_c || 0),
    horaInicio: toUTC4(sqlResult.hora_inicio_c),
    duracion: toUTC4(sqlResult.duracion_c),
    horaFin: toUTC4(sqlResult.hora_fin_c),
    secuencia: Number(sqlResult.secuencia_c || 0),
    bloqueado: sqlResult.bloqueado_c,
    totalRutas: sqlResult.total_clientes,
    userId: sqlResult.userId,
    userName: sqlResult.user_name,
    fullName: sqlResult.full_name,
  };
};