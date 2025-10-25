import { PartialType } from '@nestjs/swagger';
import { CreateIptalPolitikaDto } from './create-iptal-politika.dto';

export class UpdateIptalPolitikaDto extends PartialType(CreateIptalPolitikaDto) {}

