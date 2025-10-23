import { IsString, MinLength, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Filter } from '../interface';

export class FilterAdvancedVehiculosDto {
    @ApiProperty({
        default: 1,
        description: 'Pagina'
    })
    @IsNumber()
    page: number;

    @ApiProperty({
        default: 100,
        description: 'Filas por pagina'
    })
    @IsNumber()
    rowsPerPage: number;

    @ApiProperty({
        default: {
            easyFilter: '',
            regional: '',
            state: '',
            assigned_to: [],
        },
        description: 'Filtros de busqueda rapida de vehiculos'
    })
    @IsOptional()
    filter: Filter;

    @ApiProperty({
        default: 'fecha_creacion',
        description: 'Ordenamiento por la columna'
    })
    @IsString()
    @IsOptional()
    sortBy: string;

    @ApiProperty({
        default: 'desc',
        description: 'De forma Ascendente o Descendente'
    })
    @IsString()
    order: string;
}
