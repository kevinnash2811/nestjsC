import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateCycleDTO {
  @ApiProperty({
    default: 'Ciclo Nest',
    description: 'Nombre del ciclo',
  })
  @IsString()
  name: string;

  @ApiProperty({
    default: 'Descripcion Nest',
    description: 'Descripcion del ciclo',
  })
  @IsString()
  description: string;

  @ApiProperty({
    default: '2024-07-11 18:40:09',
    description: 'Fecha de inicio del ciclo',
  })
  @IsString()
  dateOfInit: string;

  @ApiProperty({
    default: '2024-07-11 18:40:09',
    description: 'Fecha de fin del ciclo',
  })
  @IsString()
  dateOfEnd: string;

  @ApiProperty({
    default: 7,
    description: 'Dias del ciclo',
  })
  @IsNumber()
  days: number;

  @ApiProperty({
    default: 1,
    description: 'Visitas por dia',
  })
  @IsNumber()
  visitPerDay: number;

  @ApiProperty({
    default: 1,
    description: 'Horas por dia',
  })
  @IsNumber()
  hourPerDay: number;

  @ApiProperty({
    default: 'BO04_04',
    description: 'Regional del ciclo',
  })
  @IsString()
  region: string;

  @ApiProperty({
    default: '01',
    description: 'Estado del ciclo',
  })
  @IsString()
  state: string;

  @ApiProperty({
    default: 'BO10',
    description: 'Division / Org. de ventas del ciclo',
  })
  @IsString()
  iddivision: string;

  @ApiProperty({
    default: 'BO10_10',
    description: 'Mercado / Sector del ciclo',
  })
  @IsString()
  idamercado: string;

  @ApiProperty({
    default: '1',
    description: 'Usuario asignado al ciclo',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    default: '1',
    description: 'Frecuencia asignada al ciclo',
  })
  @IsString()
  frequencyId: string;

  @ApiProperty({
    default: [],
    description: 'Lista de usuarios asignados al ciclo',
  })
  @IsArray()
  users: string[];
}
