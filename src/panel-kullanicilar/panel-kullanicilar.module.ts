import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelKullanicilarService } from './panel-kullanicilar.service';
import { PanelKullanicilarController } from './panel-kullanicilar.controller';
import { PanelProfileController } from './panel-profile.controller';
import { PanelKullanicilar } from './entities/panel-kullanicilar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PanelKullanicilar])],
  controllers: [PanelKullanicilarController, PanelProfileController],
  providers: [PanelKullanicilarService],
  exports: [PanelKullanicilarService],
})
export class PanelKullanicilarModule {}



