import { PartialType } from "@nestjs/swagger";
import { CreateOtelDto } from "./create-otel.dto";

export class UpdateOtelDto extends PartialType(CreateOtelDto) {}

