import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { HanrtFrecuenciasGetService } from '../services/hanrt_frecuencias-get.service';
import { HanrtFrecuenciasListDTO } from '../dto/hanrt_frecuencias-list.dto';
import { HanrtFrecuenciasPaginateDTO } from '../dto/hanrt_frecuencias-paginate.dto';

@Controller('hanrt_frecuencias')
@ApiTags('Frecuencias')
export class HanrtFrecuenciasGetController {
  constructor(
    private readonly hanrtFrecuenciasGetService: HanrtFrecuenciasGetService,
  ) {}

 
}
