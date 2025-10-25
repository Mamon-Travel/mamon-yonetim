import { PartialType } from '@nestjs/swagger';
import { CreatePaylasimSablonDto } from './create-paylasim-sablon.dto';

export class UpdatePaylasimSablonDto extends PartialType(CreatePaylasimSablonDto) {}



