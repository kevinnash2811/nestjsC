import { Injectable } from "@nestjs/common";
import { HanrtFrecuenciasCreateDTO } from "../dto/hanrt_frecuencias-create.dto";
import { HanrtFrecuenciasRepository } from "../repository/hanrt_frecuencias.repository";
import { HanrtFrecuenciasPaginateDTO } from "../dto/hanrt_frecuencias-paginate.dto";
import { HanrtFrecuenciasListDTO } from "../dto/hanrt_frecuencias-list.dto";

@Injectable()
export class HanrtFrecuenciasPostService {
  constructor(
    private readonly hanrtFrecuenciasRepository: HanrtFrecuenciasRepository,
  ) {}

  async create(hanrtFrecuenciasCreateDTO: HanrtFrecuenciasCreateDTO) {
    return this.hanrtFrecuenciasRepository.create(hanrtFrecuenciasCreateDTO);
  }

  list(hanrtFrecuenciasListDTO: HanrtFrecuenciasListDTO) {
    return this.hanrtFrecuenciasRepository.list(hanrtFrecuenciasListDTO);
  }

  async getAll(hanrtFrecuenciasPaginateDTO: HanrtFrecuenciasPaginateDTO) {
    const [data, total] = await Promise.all([
      this.hanrtFrecuenciasRepository.getAll(hanrtFrecuenciasPaginateDTO),
      this.hanrtFrecuenciasRepository.countAll(hanrtFrecuenciasPaginateDTO),
    ]);

    return {
      total,
      data,
    };
  }
}