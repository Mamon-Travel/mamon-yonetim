import { PartialType } from '@nestjs/swagger';
import { CreatePansiyonTipiDto } from './create-pansiyon-tipi.dto';

export class UpdatePansiyonTipiDto extends PartialType(CreatePansiyonTipiDto) {}

