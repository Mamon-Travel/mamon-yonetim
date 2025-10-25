import { PartialType } from '@nestjs/swagger';
import { CreateDovizKurDto } from './create-doviz-kur.dto';

export class UpdateDovizKurDto extends PartialType(CreateDovizKurDto) {}

