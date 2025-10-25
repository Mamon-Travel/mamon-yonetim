import { PartialType } from '@nestjs/swagger';
import { CreateFiyatTakvimDto } from './create-fiyat-takvim.dto';

export class UpdateFiyatTakvimDto extends PartialType(CreateFiyatTakvimDto) {}

