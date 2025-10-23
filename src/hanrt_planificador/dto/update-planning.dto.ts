import { Type } from "class-transformer";
import { IsNotEmptyObject, IsOptional, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UpdatePlanificadorDto } from "./planning-header-to-update.dto";
import { UpdateForDeletes, VehiclesIds } from "./partials-planning-update.dto";
import { UpdateGroupQueryDto } from "src/hanrt_itemgroup/dto";

export class UpdatePlanningQueryDto {
  @ApiProperty({
    type: UpdatePlanificadorDto,
    description: 'Datos del encabezado de la planificación',
    required: true,
  })
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => UpdatePlanificadorDto)
  headerPlan: UpdatePlanificadorDto;

  @ApiProperty({
    description: "Eliminaciones",
    required: false,
    type: UpdateForDeletes,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => UpdateForDeletes)
  deletes?: UpdateForDeletes;

  @ApiProperty({
    description: "Ids de vehiculos para eliminar o agregar",
    required: false,
    type: VehiclesIds,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => VehiclesIds)
  vehicles?: VehiclesIds;

  @ApiProperty({
    description: "Modificaciones y adiciones de grupos/rutas",
    required: false,
    isArray: true,
    type: UpdateGroupQueryDto,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => UpdateGroupQueryDto)
  groupActions: UpdateGroupQueryDto[]
}
