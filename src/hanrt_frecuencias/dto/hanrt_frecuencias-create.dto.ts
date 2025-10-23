import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";
import { HanrtFrecuenciasDetalleDTO } from "src/hanrt_frecuenciasdetalle/dto/hanrt_frecuenciasdetalle.dto";

export class HanrtFrecuenciasCreateDTO {
  @ApiProperty({
    description: 'Nombre',
    example: 'Nombre de la frecuencia',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Division',
    example: '',
  })
  @IsString()
  division: string;

  @ApiProperty({
    description: 'Amercado',
    example: '',
  })
  @IsString()
  amercado: string;

  @ApiProperty({
    description: 'Regional',
    example: '',
  })
  @IsString()
  regional: string;

  @ApiProperty({
    description: 'Modulo',
    example: 'Accounts',
  })
  @IsString()
  modulo: string;

  @ApiProperty({
    description: 'Campo',
    example: 'categoria_ventas_c',
  })
  @IsString()
  campo: string;

  @ApiProperty({
    description: 'Cantidad de visitas',
    example: 4,
  })
  @IsNumber()
  cantidadDeVisitas: number;

  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Frecuencia detalles',
    example: [
      {
        name: 'Categoria A',
        valorCampo: 'A',
        habilitado: true,
        tipoPeriodo: 'dias',
        valorPeriodo: 5,
      },
      {
        name: 'Categoria B',
        valorCampo: 'B',
        habilitado: false,
        tipoPeriodo: 'dias',
        valorPeriodo: 10,
      }
    ],
  })
  @IsArray()
  frecuenciaDetalles: HanrtFrecuenciasDetalleDTO[];
}