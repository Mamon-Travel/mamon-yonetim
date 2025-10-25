import { Module } from '@nestjs/common';
import { GorselIslemService } from './gorsel-islem.service';

@Module({
  providers: [GorselIslemService],
  exports: [GorselIslemService],
})
export class GorselIslemModule {}

