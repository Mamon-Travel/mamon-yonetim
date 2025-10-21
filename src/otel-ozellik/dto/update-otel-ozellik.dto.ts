import { PartialType } from "@nestjs/swagger";
import { CreateOtelOzellikDto } from "./create-otel-ozellik.dto";

export class UpdateOtelOzellikDto extends PartialType(CreateOtelOzellikDto) {}


