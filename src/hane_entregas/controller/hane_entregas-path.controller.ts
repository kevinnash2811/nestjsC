import { Controller, Get, Query}                          from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags }                from '@nestjs/swagger';
import { HaneEntregasPathService }                             from '../service';
// import { CreateAccountDto }                               from '../dto/create-account.dto';
// import { UpdateAccountDto }                               from '../dto/update-account.dto';
// import { FilterAdvancedDto }                              from '../dto';

@ApiTags('Entregas')
@Controller('hane-entregas')
export class Hane_EntregasPathController {
  constructor(private readonly haneEntregaspathService: HaneEntregasPathService) {}

}
