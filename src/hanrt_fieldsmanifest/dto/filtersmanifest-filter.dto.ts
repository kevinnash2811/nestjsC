import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Filter } from '../interface';
export class FilterFieldsManifestDto {
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
            module_c: 'Accounts',
            is_importable_c : '1'
            
        },
        description: 'Filtro de busqueda de Campos de Manifiesto e Importable'
    })
    @IsOptional()
    filter: Filter;

    @ApiProperty({
        default: 'field_meta_data_id_c',
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