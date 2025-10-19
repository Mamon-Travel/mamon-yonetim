import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { AnamenuAltService } from "./anamenu-alt.service";
import { CreateAnamenuAltDto } from "./dto/create-anamenu-alt.dto";
import { UpdateAnamenuAltDto } from "./dto/update-anamenu-alt.dto";
import { AnamenuAlt } from "./entities/anamenu-alt.entity";

@ApiTags("Anamenu Alt")
@Controller("anamenu-alt")
export class AnamenuAltController {
  constructor(private readonly anamenuAltService: AnamenuAltService) {}

  @Post()
  @ApiOperation({ summary: "Yeni alt menü oluştur" })
  @ApiResponse({
    status: 201,
    description: "Alt menü başarıyla oluşturuldu",
    type: AnamenuAlt,
  })
  create(@Body() createAnamenuAltDto: CreateAnamenuAltDto) {
    return this.anamenuAltService.create(createAnamenuAltDto);
  }

  @Get()
  @ApiOperation({ summary: "Tüm alt menüleri listele" })
  @ApiResponse({
    status: 200,
    description: "Alt menüler başarıyla getirildi",
    type: [AnamenuAlt],
  })
  findAll() {
    return this.anamenuAltService.findAll();
  }

  @Get("anamenu/:anamenuId")
  @ApiOperation({ summary: "Belirli bir anamenu'ye ait menüleri listele" })
  @ApiParam({ name: "anamenuId", description: "Anamenu ID" })
  @ApiResponse({
    status: 200,
    description: "Menüler başarıyla getirildi",
    type: [AnamenuAlt],
  })
  findByAnamenuId(@Param("anamenuId", ParseIntPipe) anamenuId: number) {
    return this.anamenuAltService.findByAnamenuId(anamenuId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Belirli bir alt menüyü getir" })
  @ApiParam({ name: "id", description: "Alt menü ID" })
  @ApiResponse({
    status: 200,
    description: "Alt menü başarıyla getirildi",
    type: AnamenuAlt,
  })
  @ApiResponse({ status: 404, description: "Alt menü bulunamadı" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.anamenuAltService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Alt menüyü güncelle" })
  @ApiParam({ name: "id", description: "Alt menü ID" })
  @ApiResponse({
    status: 200,
    description: "Alt menü başarıyla güncellendi",
    type: AnamenuAlt,
  })
  @ApiResponse({ status: 404, description: "Alt menü bulunamadı" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAnamenuAltDto: UpdateAnamenuAltDto,
  ) {
    return this.anamenuAltService.update(id, updateAnamenuAltDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Alt menüyü sil" })
  @ApiParam({ name: "id", description: "Alt menü ID" })
  @ApiResponse({ status: 200, description: "Alt menü başarıyla silindi" })
  @ApiResponse({ status: 404, description: "Alt menü bulunamadı" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.anamenuAltService.remove(id);
  }
}

