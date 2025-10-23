import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreatePlanificadorDto } from "./planning-header-to-create.dto";

export class UpdatePlanificadorDto extends PartialType(CreatePlanificadorDto) {
  @ApiProperty({
    example: '507f1f77-bcf86cd799-439011',
    description: 'ID de la planificación',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}