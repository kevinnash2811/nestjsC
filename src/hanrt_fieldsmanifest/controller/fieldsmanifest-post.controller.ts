import { Controller, Post, Body, Query }               from '@nestjs/common';
import { ApiBody, ApiOperation,ApiQuery, ApiTags }     from '@nestjs/swagger';
import { FieldsManifestPostService }                         from '../service';
import { FilterFieldsManifestDto }                           from '../dto';

@ApiTags('Campos de Manifiesto')
@Controller('fieldsmanifest')
export class FieldsManifestPostController {
  constructor(private readonly fieldsmanifestPostService:FieldsManifestPostService) {}

  /**
   * 
   * @param filterAdvancedDto JSON para mostrar paginacion y filtro de cuentas
   * @returns JSON
   */
  @Post('list')
  @ApiOperation({ summary: 'Obtener la lista de campos de manifiesto paginadas y filtradas por Modulo e Importable ' })
  @ApiBody({ 
    description: 'Datos para realizar filtros de busqueda avanzada',
    type: FilterFieldsManifestDto
  })
  allFieldsManifest(
    @Body() filterAdvancedDto: FilterFieldsManifestDto,
  ) {
    return this.fieldsmanifestPostService.listFieldsManifest(filterAdvancedDto);
  }

  /**
   * 
   * @param filterAdvancedDto JSON para mostrar paginacion y filtro de cuentas
   * @returns JSON
   */



}