import { Module } from '@nestjs/common';
import { HansVehiculosGetController, HansVehiculosPostController } from './controller';
import { HansVehiculosGetService, HansVehiculosPostService } from './service';


@Module({
  controllers: [
    HansVehiculosPostController,
    HansVehiculosGetController
  ],
  providers: [
    HansVehiculosPostService,
    HansVehiculosGetService
  ],
})
export class HansVehiculosModule {}
