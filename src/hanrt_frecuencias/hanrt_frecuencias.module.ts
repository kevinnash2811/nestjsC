import { Module } from '@nestjs/common';
import { HanrtFrecuenciasPostController } from './controllers/hanrt_frecuencias-post.controller';
import { HanrtFrecuenciasGetController } from './controllers/hanrt_frecuencias-get.controller';
import { HanrtFrecuenciasRepository } from './repository/hanrt_frecuencias.repository';
import { HanrtFrecuenciasGetService } from './services/hanrt_frecuencias-get.service';
import { HanrtFrecuenciasPostService } from './services/hanrt_frecuencias-post.service';

@Module({
  providers: [
    HanrtFrecuenciasRepository,
    HanrtFrecuenciasGetService,
    HanrtFrecuenciasPostService,
  ],
  controllers: [HanrtFrecuenciasPostController, HanrtFrecuenciasGetController],
})
export class HanrtFrecuenciasModule {}
