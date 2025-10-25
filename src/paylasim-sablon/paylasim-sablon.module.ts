import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaylasimSablonService } from './paylasim-sablon.service';
import { PaylasimSablonController } from './paylasim-sablon.controller';
import { PaylasimSablon } from './entities/paylasim-sablon.entity';
import { GorselIslemModule } from '../gorsel-islem/gorsel-islem.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaylasimSablon]),
    GorselIslemModule,
  ],
  controllers: [PaylasimSablonController],
  providers: [PaylasimSablonService],
  exports: [PaylasimSablonService],
})
export class PaylasimSablonModule {}



