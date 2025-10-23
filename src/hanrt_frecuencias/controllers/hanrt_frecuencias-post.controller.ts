import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HanrtFrecuenciasPostService } from '../services/hanrt_frecuencias-post.service';
import { HanrtFrecuenciasCreateDTO } from '../dto/hanrt_frecuencias-create.dto';
import { HanrtFrecuenciasListDTO } from '../dto/hanrt_frecuencias-list.dto';
import { HanrtFrecuenciasPaginateDTO } from '../dto/hanrt_frecuencias-paginate.dto';

@Controller('hanrt_frecuencias')
@ApiTags('Frecuencias')
export class HanrtFrecuenciasPostController {
  constructor(
    private readonly hanrtFrecuenciasPostService: HanrtFrecuenciasPostService,
  ) {}

  @Post('create')
  @ApiBody({ type: HanrtFrecuenciasCreateDTO })
  async create(
    @Body()
    hanrtFrecuenciasCreateDTO: HanrtFrecuenciasCreateDTO,
  ) {
    return this.hanrtFrecuenciasPostService.create(hanrtFrecuenciasCreateDTO);
  }

  @Post('list')
  @ApiBody({ type: HanrtFrecuenciasListDTO })
  async list(
    @Body()
    hanrtFrecuenciasListDTO: HanrtFrecuenciasListDTO,
  ) {
    return this.hanrtFrecuenciasPostService.list(hanrtFrecuenciasListDTO);
  }

  @Post('getAll')
  async getAll(
    @Body()
    hanrtFrecuenciasPaginateDTO: HanrtFrecuenciasPaginateDTO,
  ) {
    return this.hanrtFrecuenciasPostService.getAll(hanrtFrecuenciasPaginateDTO);
  }
}
