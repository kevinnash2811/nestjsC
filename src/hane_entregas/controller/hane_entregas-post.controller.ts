import { Body, Controller, Post}                from '@nestjs/common';
import { ApiOperation, ApiTags }                from '@nestjs/swagger';
import { HaneEntregasPostService }              from '../service';
import { FilterAdvancedEntregasDto, MainDto }   from '../dto';

@ApiTags('Entregas')
@Controller('hane-entregas')
export class Hane_EntregasPostController {
  constructor(private readonly haneEntregasPostService: HaneEntregasPostService) {}
  /**
   * 
   * @param FilterAdvancedEntregasDto JSON para mostrar paginacion y filtro de cuentas
   * @returns JSON
   */
  @Post('list')
  @ApiOperation({ summary: 'Obtener la lista de entregas de las cuentas paginadas y filtradas' })
  allHaneEntregas(@Body() filterAdvancedEntregasDto: FilterAdvancedEntregasDto) {
    return this.haneEntregasPostService.listHaneEntregas(filterAdvancedEntregasDto);
  }

  /**
   * 
   * @param filterAdvancedEntregasDto JSON para mostrar paginacion y filtro de cuentas
   * @returns retorna el total de registros segun el filtro
   */
  @Post('hane-entregas-total')
  @ApiOperation({ summary: 'Obtener el total del listado de cuentas paginadas y filtradas' })
  allTotalHaneEntregas(@Body() filterAdvancedEntregasDto: FilterAdvancedEntregasDto){
    return this.haneEntregasPostService.listTotalHaneEntregas(filterAdvancedEntregasDto);
  }

  @Post('file_list_save')
  @ApiOperation({ summary: 'Obtiene los registros de la tabla excel para cargar entregas' })
  saveListEntregas(@Body() mainDto: MainDto){
    return this.haneEntregasPostService.saveListEntregasExcel(mainDto);
  }
}
