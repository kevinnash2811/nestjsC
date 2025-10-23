import { Module } from '@nestjs/common';
import { HanrtCiclosPostController } from './controller/hanrt_ciclos-post.controller';
import { HanrtCiclosGetController } from './controller/hanrt_ciclos-get.controller';
import { HanrtCiclosPostService } from './service/hanrt_ciclos-post.service';
import { HanrtCiclosGetService } from './service/hanrt_ciclos-get.service';
import { HanrtCiclosRepository } from './repository/hanrt_ciclos.repository';

@Module({
  controllers: [HanrtCiclosPostController, HanrtCiclosGetController],
  providers: [
    HanrtCiclosRepository,
    HanrtCiclosPostService,
    HanrtCiclosGetService,
  ],
})
export class HanrtCiclosModule {}
