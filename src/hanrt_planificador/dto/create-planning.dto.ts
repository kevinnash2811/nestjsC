import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { CreatePlanificadorDto } from "./planning-header-to-create.dto";
import { ApiProperty } from "@nestjs/swagger";
import { CreateGroupQueryDto } from "src/hanrt_itemgroup/dto/create-group.dto";

export class CreatePlanningQueryDto {
  @ApiProperty({
    type: CreatePlanificadorDto,
    description: 'Datos del encabezado de la planificación',
  })
  @ValidateNested()
  @Type(() => CreatePlanificadorDto)
  headerPlan: CreatePlanificadorDto;

  @ApiProperty({
    type: Array,
    description: 'Ids de vehiclos asignados a la planificación',
    example: ['fe3234-23451-aaa3f-as33c-abc2331ad', 'ffdd12-23451-aaa3f-as33c-abc2331ad']
  })
  @IsArray()
  @IsOptional()
  vehiclesIds?: string[];

  @ApiProperty({
    description: 'Array de Objectos de grupos',
    type: CreateGroupQueryDto,
    isArray: true,
    required: false,
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => CreateGroupQueryDto)
  groups?: CreateGroupQueryDto[];
}