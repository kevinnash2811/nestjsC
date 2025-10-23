import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetGestionTnpDTO {
  @ApiProperty({
    example: '10002267',
    description: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  CodUsuario?: string;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber() 
  cantidadRegistros?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class GetHistoricoNotasDTO {
  @ApiProperty({
    example: '100034',
    description: 'Código del usuario para filtrar las notas.',
    required: true,
  })
  @IsString()
  codUsuario: string;

  @ApiProperty({
    example: '2025-01-01 00:00:00',
    description: 'Fecha de inicio para filtrar las notas.',
    required: true,
  })
  @IsString()
  fechaInicio: string;

  @ApiProperty({
    example: '2025-01-30 00:00:00',
    description: 'Fecha de fin para filtrar las notas.',
    required: true,
  })
  @IsString()
  fechaFin: string;

  @ApiProperty({
    example: '',
    description: 'ID de contacto para filtrar las notas. (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  contacto_id?: string | null;
}
