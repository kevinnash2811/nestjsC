import { Module } from '@nestjs/common';
import { MarcadoresPostController } from './controller/marcadores_post.controller';
import { MarcadoresPostService } from './service/marcadores_post.service';
import { MarcadoresRepository } from './repository/marcadores.repository';

@Module({
  controllers: [MarcadoresPostController],
  providers: [
    MarcadoresRepository,
    MarcadoresPostService
  ],
})
export class MarcadoresModule {}
