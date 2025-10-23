import { Injectable, Logger } from '@nestjs/common';
import { CreateZonaDTO } from '../dto';
import { HanrtZonasRepository } from '../repository/hanrt_zonas.repository';
@Injectable()
export class HanrtZonasPostService {
  constructor(private readonly hanrtZonasRepository: HanrtZonasRepository) {}

  async createHanrtZonas(createzonaDTO: CreateZonaDTO) {
    return this.hanrtZonasRepository.createZonaConRelacion(createzonaDTO);
  }
}

