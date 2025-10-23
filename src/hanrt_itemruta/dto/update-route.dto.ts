import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateRouteQueryDto } from "./create-route.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateRouteQueryDto extends PartialType(CreateRouteQueryDto) {
  @ApiProperty({
    description: "Id del la ruta",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}