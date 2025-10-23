import { Injectable } from '@nestjs/common';
import { HanrtFrecuenciasRepository } from '../repository/hanrt_frecuencias.repository';
import { HanrtFrecuenciasListDTO } from '../dto/hanrt_frecuencias-list.dto';
import { HanrtFrecuenciasPaginateDTO } from '../dto/hanrt_frecuencias-paginate.dto';

@Injectable()
export class HanrtFrecuenciasGetService {
  constructor(
    private readonly hanrtFrecuenciasRepository: HanrtFrecuenciasRepository,
  ) {}


}
