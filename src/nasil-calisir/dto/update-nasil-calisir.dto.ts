import { PartialType } from "@nestjs/swagger";
import { CreateNasilCalisirDto } from "./create-nasil-calisir.dto";

export class UpdateNasilCalisirDto extends PartialType(CreateNasilCalisirDto) {}

