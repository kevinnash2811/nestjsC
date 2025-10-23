import { Module } from '@nestjs/common';
import { HanrtTerritoriosPostController } from './controller/hanrt_territorios-post.controller';
import { HanrtTerritoriosGetController } from './controller/hanrt_territorios-get.controller';
import { TerritorioPatchController } from './controller/hanrt_territorios-patch.controller';
import { HanrtTerritoriosDeleteController } from './controller/hanrt_territorios-delete.controller';
import { HanrtTerritoriosPostService } from './service/hanrt_territorios-post.service';
import { HanrtTerritoriosGetService } from './service/hanrt_territorios-get.service';
import { HanrtTerritoriosDeleteService } from './service/hanrt_territorios-delete.service';
import { TerritorioPatchService } from './service/hanrt_territorios-patch.service';
import { HanrtTerritoriosRepository } from './repository/hanrt_territorios.repository';

@Module({
  controllers: [HanrtTerritoriosPostController,TerritorioPatchController,HanrtTerritoriosDeleteController, HanrtTerritoriosGetController],
  providers: [
    HanrtTerritoriosRepository,
    HanrtTerritoriosPostService,
    TerritorioPatchService,
    HanrtTerritoriosDeleteService,
    HanrtTerritoriosGetService
  ],
})
export class HanrtTerritoriosModule {}
