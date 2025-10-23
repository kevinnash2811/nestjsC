import { ApiProperty } from '@nestjs/swagger';

export class ItemGroupDto {
  @ApiProperty({
    description: 'ID único del grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Fecha de creación (db)',
    example: '2024-12-31T19:21:34'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Nombre del grupo de items',
    example: 'Grupo de Ruta Norte'
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del grupo de items',
    example: 'Ruta de clientes en la zona norte',
  })
  description?: string;

  @ApiProperty({
    description: 'ID del usuario asignado',
    example: '660e8400-e29b-41d4-a716-446655440001'
  })
  assignedUserId: string;

  @ApiProperty({
    description: 'Fecha planificada en formato YYYY-MM-DD',
    example: '2024-01-15'
  })
  fechaPlan: string;

  @ApiProperty({
    description: 'Capacidad del grupo',
    example: 10
  })
  capacidad: number;

  @ApiProperty({
    description: 'Hora de inicio en formato date string',
    example: '2025-08-29T12:30:00.000Z'
  })
  horaInicio: string;

  @ApiProperty({
    description: 'Duración en formato date string',
    example: '2025-08-29T00:30:00.000Z'
  })
  duracion: string;

  @ApiProperty({
    description: 'Hora de fin en formato date string',
    example: '2025-08-29T00:30:00.000Z'
  })
  horaFin: string;

  @ApiProperty({
    description: 'Secuencia del grupo',
    example: 1
  })
  secuencia: number;

  @ApiProperty({
    description: 'Indica si el grupo está bloqueado 00 | 01',
    example: false
  })
  bloqueado: string;

  @ApiProperty({
    description: 'Total de rutas en el grupo',
    example: 8
  })
  totalRutas: number;

  @ApiProperty({
    description: 'ID del usuario',
    example: '660e8400-e29b-41d4-a716-446655440001'
  })
  userId: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'juan.perez'
  })
  userName: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez'
  })
  fullName: string;
}
