import { Injectable, Logger } from '@nestjs/common';
import { CreateCycleDTO } from '../dto';
import { HanrtCiclosRepository } from '../repository/hanrt_ciclos.repository';
@Injectable()
export class HanrtCiclosPostService {
  constructor(private readonly hanrtCiclosRepository: HanrtCiclosRepository) {}

  async getHanrtCiclos() {
    const result = await this.hanrtCiclosRepository.getHanrtCiclos();

    return result.map((e) => ({ ...e, frecuencia: JSON.parse(e.frecuencia) }));
  }

  async createHanrtCiclos(createcycleDTO: CreateCycleDTO) {
    return this.hanrtCiclosRepository.createHanrtCiclos(createcycleDTO);
  }
}
