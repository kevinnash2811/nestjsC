import { Module } from '@nestjs/common';
import { FirebaseService } from './service';

@Module({
  controllers: [],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
