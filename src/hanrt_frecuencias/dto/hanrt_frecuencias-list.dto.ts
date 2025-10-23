import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class HanrtFrecuenciasListDTO {
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
}