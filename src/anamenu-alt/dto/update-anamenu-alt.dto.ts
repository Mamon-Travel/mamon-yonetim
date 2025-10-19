import { PartialType } from "@nestjs/swagger";
import { CreateAnamenuAltDto } from "./create-anamenu-alt.dto";

export class UpdateAnamenuAltDto extends PartialType(CreateAnamenuAltDto) {}


