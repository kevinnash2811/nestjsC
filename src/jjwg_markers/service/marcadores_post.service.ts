import { Injectable, Logger } from '@nestjs/common';
import { CreateMarcadoresDTO } from '../dto';
import { MarcadoresRepository } from '../repository/marcadores.repository';
@Injectable()
export class MarcadoresPostService {
  constructor(private readonly marcadoresRepository: MarcadoresRepository) {}

  async createMarcadores(createMarcadoresDTO: CreateMarcadoresDTO) {
    return this.marcadoresRepository.createMarcadorConRelacion(createMarcadoresDTO);
  }
}

