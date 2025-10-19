import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KullanicilarService } from './kullanicilar.service';
import { KullanicilarController } from './kullanicilar.controller';
import { ProfileController } from './profile.controller';
import { Kullanicilar } from './entities/kullanicilar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kullanicilar])],
  controllers: [KullanicilarController, ProfileController],
  providers: [KullanicilarService],
  exports: [KullanicilarService],
})
export class KullanicilarModule {}
