import { Module }              from '@nestjs/common';
import { UsersGetService, UsersPostService }     from './service';
import { UsersGetController, UsersPostController }  from './controller';

@Module({
  controllers: [
    UsersGetController,
    UsersPostController],
  providers: [
    UsersGetService, 
    UsersPostService],
})
export class UsersModule {}

