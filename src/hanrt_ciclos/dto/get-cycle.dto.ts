import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsArray, IsOptional } from 'class-validator';

// export class GetCycleDTO {
//   @ApiProperty({
//     example: '1415e2ec-ad2e-4261-848c-853457ed267d',
//     description: 'ID único del ciclo',
//   })
//   @IsString()
//   id: string;

//   @ApiProperty({
//     example: 'Noviembre - 2024',
//     description: 'Nombre del ciclo',
//   })
//   @IsString()
//   ciclo_name: string;

//   @ApiProperty({
//     example: '17',
//     description: 'Cantidad de visitas por día',
//   })
//   @IsString()
//   ciclo_cantidad_visitas_dia_c: string;

//   @ApiProperty({
//     example: '20',
//     description: 'Número de días en el ciclo',
//   })
//   @IsString()
//   ciclo_dias_c: string;

//   @ApiProperty({
//     example: '8',
//     description: 'Horas por día en el ciclo',
//   })
//   @IsString()
//   ciclo_horas_por_dia_c: string;

//   @ApiProperty({
//     example: 'BO10',
//     description: 'ID de la división',
//   })
//   @IsString()
//   ciclo_iddivision_c: string;

//   @ApiProperty({
//     example: 'BO10_10',
//     description: 'ID del mercado',
//   })
//   @IsString()
//   ciclo_idamercado_c: string;

//   @ApiProperty({
//     example: 'BO04_04',
//     description: 'ID de la región',
//   })
//   @IsString()
//   ciclo_region_c: string;

//   @ApiProperty({
//     example: '02',
//     description: 'Estado del ciclo',
//   })
//   @IsString()
//   ciclo_estado_c: string;

//   @ApiProperty({
//     example: '2024-11-01T05:00:00.000Z',
//     description: 'Fecha y hora de inicio del ciclo',
//   })
//   @IsString()
//   ciclo_fecha_inicio_hora_c: string;

//   @ApiProperty({
//     example: '2024-11-30T04:00:00.000Z',
//     description: 'Fecha y hora de fin del ciclo',
//   })
//   @IsString()
//   ciclo_fecha_fin_hora_c: string;

//   @ApiProperty({
//     example: 'BO10 COFAR',
//     description: 'Etiqueta de la división',
//   })
//   @IsString()
//   iddivision_c_label: string;

//   @ApiProperty({
//     example: '10 Medicamentos',
//     description: 'Etiqueta del mercado',
//   })
//   @IsString()
//   idamercado_c_label: string;

//   @ApiProperty({
//     example: 'La Paz',
//     description: 'Etiqueta de la región',
//   })
//   @IsString()
//   region_c_label: string;

//   @ApiProperty({
//     example: 'Activo',
//     description: 'Etiqueta del estado',
//   })
//   @IsString()
//   estado_c_label: string;
// }

export class GetCycleDTO {
  // @ApiProperty({
  //   example: '1415e2ec-ad2e-4261-848c-853457ed267d',
  //   description: '',
  //   required: false, 
  // })
  // @IsOptional()
  // @IsString()
  // user_id?: string;

  @ApiProperty({
    example: '10002267',
    description: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  cod_usuario?: string;
}
