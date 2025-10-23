import { Module } from '@nestjs/common';
import { Hanrt_ConductorGetService } from './service/hanrt_conductor-get.service';
import { Hanrt_ConductorGetController } from './controller/hanrt_conductor-get.controller';

@Module({
  controllers: [Hanrt_ConductorGetController],
  providers: [Hanrt_ConductorGetService],
})
export class HanrtConductorModule {}
