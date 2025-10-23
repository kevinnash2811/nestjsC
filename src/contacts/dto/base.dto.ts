import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class ContactBaseDto{
  @ApiProperty({
    default: '',
    description: 'Id de Contacto'
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  id: string;
}