import { PartialType } from '@nestjs/swagger';
import { CreateStokTakvimDto } from './create-stok-takvim.dto';

export class UpdateStokTakvimDto extends PartialType(CreateStokTakvimDto) {}

