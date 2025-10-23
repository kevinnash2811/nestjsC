import { Module } from '@nestjs/common';
import { HanrtZonasPostController } from './controller/hanrt_zonas-post.controller';
import { ZonaPatchController } from './controller/hanrt_zonas-patch.controller';
import { HanrtZonasDeleteController } from './controller/hanrt_zonas-delete.controller';
import { HanrtZonasPostService } from './service/hanrt_zonas-post.service';
import { HanrtZonasDeleteService } from './service/hanrt_zonas-delete.service';
import { ZonaPatchService } from './service/hanrt_zonas-patch.service';
import { HanrtZonasRepository } from './repository/hanrt_zonas.repository';

@Module({
  controllers: [HanrtZonasPostController, ZonaPatchController, HanrtZonasDeleteController],
  providers: [
    HanrtZonasRepository,
    HanrtZonasPostService,
    ZonaPatchService,
    HanrtZonasDeleteService
 
  ],
})
export class HanrtZonasModule {}
