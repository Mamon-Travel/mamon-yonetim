import { PartialType } from "@nestjs/swagger";
import { CreateCeviriDto } from "./create-ceviri.dto";

export class UpdateCeviriDto extends PartialType(CreateCeviriDto) {}

