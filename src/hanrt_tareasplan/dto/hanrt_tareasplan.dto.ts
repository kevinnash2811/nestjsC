import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { TareaPara, TareasPlan } from '../types';
export class HanrtTareasPlanDto {
    @ApiProperty({
      description: 'Tipo de Tarea',
      enum: TareasPlan,
      examples: {
          T00: { value: 'T00', description: 'Todas' },
          T01: { value: 'T01', description: 'Visitas' },
          T02: { value: 'T02', description: 'Distribución' },
          T03: { value: 'T03', description: 'Entregas' },
      },
    })
    @IsEnum(TareasPlan)
    tipoTarea: TareasPlan;

    @ApiProperty({
        description: 'Tarea Para',
        enum: TareaPara,
        examples: {
            H00: { value: 'H00', description: 'Todas' },
            H01: { value: 'H01', description: 'Cabecera' },
            H02: { value: 'H02', description: 'Regla' },
        },
    })
    @IsEnum(TareaPara)
    tareaPara: TareaPara;

    @ApiProperty({
        description: 'Fecha Inicio',
        default: '2024-07-11 18:40:09',
        format: 'YYYY-MM-DD HH:mm:ss',
        type: String,
        required: true,
    })
    @IsString()
    fechaInicio: string;

    @ApiProperty({
        description: 'Fecha Fin',
        default: '2024-07-11 18:40:09',
        format: 'YYYY-MM-DD HH:mm:ss',
        type: String,
        required: true,
    })
    @IsString()
    fechaFin: string;
}
