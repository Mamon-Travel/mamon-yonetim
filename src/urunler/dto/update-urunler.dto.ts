import { PartialType } from '@nestjs/swagger';
import { CreateUrunlerDto } from './create-urunler.dto';

export class UpdateUrunlerDto extends PartialType(CreateUrunlerDto) {}

