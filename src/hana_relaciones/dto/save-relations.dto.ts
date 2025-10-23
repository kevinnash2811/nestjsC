import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SaveRelationsDto {

    @ApiProperty({
        default: "default name",
        description: 'nombre de la relacion'
    })
    @IsString()
    name : string;

    @ApiProperty({
        default: "6da8eab2-7d37-7a25-4d42-5d23cfd43c6a",
        description: 'id del usuario'
    })
    @IsString()
    userId : string;

    @ApiProperty({
        default: "default description",
        description: 'descripcion de la relacion'
    })
    @IsString()
    description? : string;

    @ApiProperty({
        default: "01",
        description: 'tipo de relacion de la relacion'
    })
    @IsString()
    tipoRelacion? : string;

    @ApiProperty({
        default: "no",
        description: 'campo principal de la relacion'
    })
    @IsString()
    principal: string;

    @ApiProperty({
        default: "03",
        description: 'iddivision de la relacion'
    })
    @IsString()
    iddivisionC? : string;

    @ApiProperty({
        default: "03_01",
        description: 'idmercado de la relacion'
    })
    @IsString()
    idamercadoC? : string;

    @ApiProperty({
        default: "01",
        description: 'idregional de la relacion'
    })
    @IsString()
    idregionalC? : string;
}