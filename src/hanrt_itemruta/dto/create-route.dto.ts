import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateRouteQueryDto {
  @ApiProperty({ example: 'Visita test 1', description: 'Nombre de la visita' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Descripcion tst 1',
    description: 'Descripción de la visita',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'TV02', description: 'Tipo de visita (código)' })
  @IsString()
  @IsNotEmpty()
  tipoVisita: string;

  @ApiProperty({ example: 'sales', description: 'Tipo de visita para hbm' })
  @IsString()
  @IsNotEmpty()
  tipoVisitaHbm: string;

  @ApiProperty({
    example: '2025-09-10T04:00:00.000Z',
    description: 'Fecha de inicio',
  })
  @IsString()
  @IsNotEmpty()
  fechaInicio: string;

  @ApiProperty({
    example: '2025-09-10T12:30:00.000Z',
    description: 'Hora de inicio',
  })
  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @ApiProperty({
    example: '2025-09-10T04:30:00.000Z',
    description: 'Duración de la visita',
  })
  @IsString()
  @IsNotEmpty()
  duracion: string;

  @ApiProperty({ example: '2025-09-13T12:30:00.000Z', description: 'Fecha de fin' })
  @IsString()
  @IsNotEmpty()
  fechaFin: string;

  @ApiProperty({ example: '2025-09-10T13:00:00.000Z', description: 'Hora de fin' })
  @IsString()
  @IsNotEmpty()
  horaFin: string;

  @ApiProperty({ example: 1, description: 'Secuencia de la visita' })
  @IsInt()
  secuencia: number;

  @ApiProperty({
    example: '01010FA5-F21A-44A9-A71C-E5C67783EED8',
    description: 'ID de la cuenta asociada',
  })
  @IsString()
  @IsNotEmpty()
  idAccount: string;

  @ApiProperty({
    example: 'E9EF0FA5-F21A-44A9-A71C-E5C67783EED8',
    description: 'ID de contacto asociado',
  })
  @IsString()
  @IsOptional()
  idContact?: string;

  @ApiProperty({ example: '1', description: 'ID del usuario responsable' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '-17.50808', description: 'Latitud de la visita' })
  @IsString()
  @IsOptional()
  latitud?: string;

  @ApiProperty({ example: '-81.02573', description: 'Longitud de la visita' })
  @IsString()
  @IsOptional()
  longitud?: string;

  @ApiProperty({
    type: Array,
    description: 'Array de ids de tareas asociadas a la ruta',
    example: ['599a02b1-d433-cee6-b44d-668fee5c8bef', 'aaaa6b1-d433-cee6-b44d-668fee5c8bef']
  })
  @IsOptional()
  @IsArray()
  tareasPlan?: string[];

  @ApiProperty({
    type: Array,
    description: 'Array de Ids de entregas asociadas a la ruta',
    example: ['fefefefe-d433-cee6-b44d-668fee5c8bef', '999292d-cee6-b44d-668fee5c8bef']
  })
  @IsOptional()
  @IsArray()
  entregasList?: string[];
}
