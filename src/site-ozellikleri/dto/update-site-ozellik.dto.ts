import { PartialType } from "@nestjs/swagger";
import { CreateSiteOzellikDto } from "./create-site-ozellik.dto";

export class UpdateSiteOzellikDto extends PartialType(CreateSiteOzellikDto) {}

