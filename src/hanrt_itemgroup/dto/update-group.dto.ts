import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreateGroupQueryDto } from "./create-group.dto";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateRouteQueryDto } from "src/hanrt_itemruta/dto";
import { Type } from "class-transformer";

export class UpdateGroupQueryDto extends PartialType(OmitType(CreateGroupQueryDto, ["rutas"])) {
  @ApiProperty({
    description: "Id del grupo",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;


  @ApiProperty({
    description: 'Array de Rutas del grupo',
    type: UpdateRouteQueryDto,
    isArray: true,
    required: false,
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => UpdateRouteQueryDto)
  rutas?: UpdateRouteQueryDto[];
}