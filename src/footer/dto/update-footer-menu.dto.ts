import { PartialType } from "@nestjs/swagger";
import { CreateFooterMenuDto } from "./create-footer-menu.dto";

export class UpdateFooterMenuDto extends PartialType(CreateFooterMenuDto) {}

