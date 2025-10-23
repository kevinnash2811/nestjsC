import { Module } from '@nestjs/common';
import { Hane_EntregasGetController, Hane_EntregasPostController, Hane_EntregasPathController } from './controller';
import { HaneEntregasGetService, HaneEntregasPostService, HaneEntregasPathService } from './service';

@Module({
  controllers: [
    Hane_EntregasGetController,
    Hane_EntregasPostController,
    Hane_EntregasPathController
  ],
  providers: [
    HaneEntregasGetService,
    HaneEntregasPostService,
    HaneEntregasPathService
  ],
})
export class HaneEntregasModule {}
