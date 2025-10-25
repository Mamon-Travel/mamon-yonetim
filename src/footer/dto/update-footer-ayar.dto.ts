import { PartialType } from "@nestjs/swagger";
import { CreateFooterAyarDto } from "./create-footer-ayar.dto";

export class UpdateFooterAyarDto extends PartialType(CreateFooterAyarDto) {}

