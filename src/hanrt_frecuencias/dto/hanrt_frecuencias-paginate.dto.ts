import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class HanrtFrecuenciasPaginateDTO {
  @ApiProperty({
    description: 'Division',
    example: ''
  })
  @IsString()
  @IsOptional()
  division: string;

  @ApiProperty({
    description: 'Amercado',
    example: ''
  })
  @IsString()
  @IsOptional()
  amercado: string;

  @ApiProperty({
    description: 'Regional',
    example: ''
  })
  @IsString()
  @IsOptional()
  regional: string;

  @ApiProperty({
    description: 'Cantidad de registros',
    example: 10
  })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'Pagina',
    example: 1
  })
  @IsNumber()
  page: number;  
}