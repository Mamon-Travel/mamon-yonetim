import { PartialType } from "@nestjs/swagger";
import { CreateHizmetlerDto } from "./create-hizmetler.dto";

export class UpdateHizmetlerDto extends PartialType(CreateHizmetlerDto) {}






