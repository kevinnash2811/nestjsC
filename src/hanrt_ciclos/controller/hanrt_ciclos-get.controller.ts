import { Body, Controller, Get, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { GetCycleDTO } from '../dto/get-cycle.dto';
import { HanrtCiclosGetService } from '../service/hanrt_ciclos-get.service';

@ApiTags('Ciclos')
@Controller('hanrt_ciclos')

export class HanrtCiclosGetController {
  constructor(
    private readonly hanrtCiclosGetService: HanrtCiclosGetService,
  ) {}
}
