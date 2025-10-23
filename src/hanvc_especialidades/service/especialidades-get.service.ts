import { Injectable } from '@nestjs/common';
import { EspecialidadesRepository } from '../repository/especialidades.repository';

@Injectable()
export class EspecialidadesGetService {
  constructor(private readonly especialidadesRepository: EspecialidadesRepository) {}

  async getAll() {
    return await this.especialidadesRepository.getAll();
  }
}