import { Controller, Post, Body }               from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags }     from '@nestjs/swagger';
import { AccountsPostService }                         from '../service';
import { AccountWithContactsFilter, FilterAdvancedDto }                           from '../dto';

@ApiTags('Cuentas')
@Controller('accounts')
export class AccountsPostController {
  constructor(private readonly accountsPostService: AccountsPostService) {}

  /**
   * 
   * @param filterAdvancedDto JSON para mostrar paginacion y filtro de cuentas
   * @returns JSON
   */
  @Post('list')
  @ApiOperation({ summary: 'Obtener la lista de cuentas paginadas y filtradas' })
  @ApiBody({ 
    description: 'Datos para realizar filtros de busqueda avanzada',
    type: FilterAdvancedDto
  })
  allAccounts(
    @Body() filterAdvancedDto: FilterAdvancedDto,
  ) {
    return this.accountsPostService.listAccounts(filterAdvancedDto);
  }

  /**
   * 
   * @param filterAdvancedDto JSON para mostrar paginacion y filtro de cuentas
   * @returns JSON
   */
  @Post('accounts-total')
  @ApiOperation({ summary: 'Obtener el total del listado de cuentas paginadas y filtradas' })
  allTotalAccounts(@Body() filterAdvancedDto: FilterAdvancedDto){
    return this.accountsPostService.listTotalAccounts(filterAdvancedDto);
  }

  @Post('list-with-contacts')
  @ApiOperation({ summary: 'Obtener la lista de cuentas paginadas y filtradas por busqueda, con contactos asociados' })
  @ApiBody({
    description: 'Objeto para realizar filtros de busqueda avanzada',
    type: AccountWithContactsFilter
  })
  async getFilterList(@Body() body: AccountWithContactsFilter){
    const result = await this.accountsPostService.filterListWithContacts(body);
    const resRecords = await this.accountsPostService.totalRecordsListWithContacts(body);
    const { total } = resRecords[0];
    return { success: true, data: result, totalRecords: total };
  }
}
