import { PartialType } from '@nestjs/swagger';
import { CreateSepetDto } from './create-sepet.dto';

export class UpdateSepetDto extends PartialType(CreateSepetDto) {}


