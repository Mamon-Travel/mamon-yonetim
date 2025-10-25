import { PartialType } from '@nestjs/swagger';
import { CreateDinamikSayfaDto } from './create-dinamik-sayfa.dto';

export class UpdateDinamikSayfaDto extends PartialType(CreateDinamikSayfaDto) {}

