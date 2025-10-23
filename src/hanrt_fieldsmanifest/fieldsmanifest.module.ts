import { Module }              from '@nestjs/common';
import { FieldsManifestPostService }     from './service';
import { FieldsManifestPostController }  from './controller';

@Module({
  controllers: [
    FieldsManifestPostController],
  providers: [
    FieldsManifestPostService],
})
export class FieldsManifestModule {}

