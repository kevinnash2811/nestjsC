import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoTarea } from '../types';
export class TiposTareasDto {
    @ApiProperty({
      description: 'Tipo de Tarea',
      enum: TipoTarea,
      examples: {
          TT00: { value: 'T00', description: 'Todas' },
          TT01: { value: 'T01', description: 'Visita' },
          TT02: { value: 'T02', description: 'Distribución' },
          TT03: { value: 'T03', description: 'Entregas' },
      },
    })
    @IsEnum(TipoTarea)
    tipoTarea: TipoTarea;

    @IsString()
    fechaInicio: string;

    @IsString()
    fechaFin: string;
}
