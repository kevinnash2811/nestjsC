import { Controller, Get, Query, Body}                          from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags }                from '@nestjs/swagger';
import { HaneEntregasGetService }                             from '../service';
import moment from 'moment';
// import { CreateAccountDto }                               from '../dto/create-account.dto';
// import { UpdateAccountDto }                               from '../dto/update-account.dto';
// import { FilterAdvancedDto }                              from '../dto';

@ApiTags('Entregas')
@Controller('hane-entregas')
export class Hane_EntregasGetController {
  constructor(private readonly haneEntregasGetService: HaneEntregasGetService) {}

  /**
   * 
   * @param iduser id del usuario
   * @returns retorna todas las lat y lng de todos las entregas si se pasa el ID del usuario retornara solo las cuentas con entregas del usuario.
   */
  @Get('all-hane_entregas-latlng')
  @ApiOperation({ summary: 'Obtener todas las cuentas con entregas con su lat y lng del usuario o en general' })
  @ApiQuery({
    name: 'iduser',
    type: 'string',
    required: false,
    description: 'ID del usuario para obtener las entregas pendientes del usuario, puede estar vacio para traer todas las entregas que tengan lat y lng',
    example: 'e53d41d6-3f4f-2cfc-198a-555f644444ba92d4457',
  })
  allHaneEntregasUser(@Query('iduser') iduser: string){
    return this.haneEntregasGetService.listHaneEntregasUser(iduser)
  }

  /**
   * 
   * @param idaccount id de una cuenta, obtendra el detalle de la entrega y detalle de la cuenta
   * @returns 
   */
  @Get('hane-entregas-get-id')
  @ApiOperation({ summary: 'Obtiene la información detallada de una entrega' })
  @ApiQuery({
    name: 'idaccount',
    type: 'string',
    required: false,
    description: 'ID de la cuenta para obtener la información detallada de la entrega',
    example: '01010FA5-F21A-44A9-A71C-E5C67783EED8',
  })
  @ApiQuery({
    name: 'from',
    type: 'string',
    required: false,
    description: 'Fecha de inicio para filtrar (formato YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @ApiQuery({
    name: 'to',
    type: 'string',
    required: false,
    description: 'Fecha de fin para filtrar (formato YYYY-MM-DD)',
    example: '2023-12-31',
  })
  haneEntregasGetAll(
    @Query('idaccount') idaccount: string,
    @Query('from') from?: string,
    @Query('to') to?: string
  ) {
    const dateRange = { 
      from: from ? moment(from).format('YYYY-MM-DD') : null, 
      to: to ? moment(to).format('YYYY-MM-DD') : null 
    };
    return this.haneEntregasGetService.haneEntregasGetAll(idaccount, dateRange);
  }
}
