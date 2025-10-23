import { Module } from '@nestjs/common';
import { HanrtGestionTNPGetController } from './controller/hanrt_gestiontnp-get.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { HanrtGestionTNPGetService } from './service';
@Module({
  imports: [FirebaseModule],
  controllers: [HanrtGestionTNPGetController],
  providers: [HanrtGestionTNPGetService],
})
export class HanrtGestionTnpModule { }
