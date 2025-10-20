import { PartialType } from "@nestjs/swagger";
import { CreateOdaTipiDto } from "./create-oda-tipi.dto";

export class UpdateOdaTipiDto extends PartialType(CreateOdaTipiDto) {}

