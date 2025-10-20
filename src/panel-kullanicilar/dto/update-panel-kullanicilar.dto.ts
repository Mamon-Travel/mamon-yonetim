import { PartialType } from '@nestjs/swagger';
import { CreatePanelKullanicilarDto } from './create-panel-kullanicilar.dto';

export class UpdatePanelKullanicilarDto extends PartialType(
  CreatePanelKullanicilarDto,
) {}



