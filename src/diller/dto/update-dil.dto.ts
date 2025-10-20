import { PartialType } from "@nestjs/swagger";
import { CreateDilDto } from "./create-dil.dto";

export class UpdateDilDto extends PartialType(CreateDilDto) {}

