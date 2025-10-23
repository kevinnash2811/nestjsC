import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountPlanningDto } from 'src/accounts/dto';
import { ContactPlanningDto } from 'src/contacts/dto';
import { ReglaTareasPlanningDto } from 'src/hanrt_tareasplan/dto/hanrt_tarea-planning.dto';

export class RoutePlanningDto {
  @ApiProperty({
    example: 'b5a77f9e-166d-43c1-8650-58bdee00f725',
    description: 'ID de la ruta',
  })
  id: string;

  @ApiProperty({ example: 1, description: 'Secuencia de la ruta' })
  secuencia: number;

  @ApiProperty({ example: 'FARMAELIAS SRL', description: 'Nombre de la ruta' })
  name: string;

  @ApiProperty({ example: 'TV01', description: 'Tipo de visita' })
  tipoVisitaId: string;

  @ApiProperty({
    example: 'Entrega',
    description: 'Etiqueta del tipo de visita',
  })
  tipoVisita: string;

  @ApiProperty({ example: '25-08-2025', description: 'Fecha de inicio' })
  fechaInicio: string;

  @ApiProperty({ example: '08:00', description: 'Hora de inicio' })
  horaInicio: string;

  @ApiProperty({ example: '00:30', description: 'Duración' })
  duracion: string;

  @ApiProperty({ example: '25-08-2025', description: 'Fecha de fin' })
  fechaFin: string;

  @ApiProperty({ example: '08:30', description: 'Hora de fin' })
  horaFin: string;

  @ApiProperty({ example: '-16.50121307373047', description: 'Latitud' })
  latitud: string;

  @ApiProperty({ example: '-68.12252807617188', description: 'Longitud' })
  longitud: string;

  @ApiProperty({
    example: 'dfbcd0bd-1c23-557c-5639-66b1e13f61dc',
    description: 'ID del usuario asignado',
  })
  assignedUserId: string;

  @ApiProperty({
    example: 'Federico Añexz',
    description: 'Nombre del usuario asignado',
  })
  assignedUser: string;


  @ApiProperty({
    example: 'xxxxx-xxxxx-xxxxxx-xxxxxxxxx',
    description: 'Id de hana_visitas',
  })
  visitaId: string | null;

  @ApiProperty({
    example: 'Visita nombre',
    description: 'name de hana_visitas',
  })
  visitaNombre: string | null;

  @ApiProperty({ example: 'POR INICIAR', description: 'Estado de la visita' })
  visitaEstado: string | null;

  @ApiProperty({ example: '1/0', description: 'Visitas en el ciclo' })
  visitasCiclo: string | null;

  @ApiProperty({ example: 1, description: 'Número de visita hana_visitas' })
  nroVisita: number | null;

  @ApiPropertyOptional({ example: null, description: 'ID de la visita HANA' })
  visitaHanaVisitasId?: string | null;

  @ApiProperty({ example: 1, description: 'Número de tareas de la visita -> tasks' })
  qtyTasks: number;

  @ApiProperty({
    description: 'Reglas con tareas',
    isArray: true,
    type: ReglaTareasPlanningDto,
  })
  tareasRegla: ReglaTareasPlanningDto[];

  @ApiPropertyOptional({
    description: 'Cuenta relacionada a la ruta',
  })
  account?: AccountPlanningDto;

  @ApiPropertyOptional({
    description: 'Contacto relacionado a la ruta'
  })
  contact?: ContactPlanningDto;
}
