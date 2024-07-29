import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UploaderService],
  exports: [UploaderService],
})
export class UploaderModule {}
