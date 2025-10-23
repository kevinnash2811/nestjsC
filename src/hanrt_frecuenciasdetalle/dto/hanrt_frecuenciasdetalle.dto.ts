import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class HanrtFrecuenciasDetalleDTO {
  @ApiProperty({
    description: 'Nombre',
    example: '',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Valor Campo',
    example: '',
  })
  @IsString()
  @IsOptional()
  valorCampo: string;

  @ApiProperty({
    description: 'Habilitado',
    example: '',
  })
  @IsBoolean()
  habilitado: boolean;

  @ApiProperty({
    description: 'Tipo Periodo',
    example: '',
  })
  @IsString()
  tipoPeriodo: string;

  @ApiProperty({
    description: 'Valor Periodo',
    example: '',
  })
  @IsNumber()
  valorPeriodo: number;
}
