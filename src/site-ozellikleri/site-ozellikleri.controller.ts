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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { SiteOzellikleriService } from "./site-ozellikleri.service";
import { CreateSiteOzellikDto } from "./dto/create-site-ozellik.dto";
import { UpdateSiteOzellikDto } from "./dto/update-site-ozellik.dto";
import { SiteOzellik } from "./entities/site-ozellik.entity";

@ApiTags("Site Özellikleri")
@Controller("site-ozellikleri")
export class SiteOzellikleriController {
  constructor(private readonly siteOzellikleriService: SiteOzellikleriService) {}

  @Post()
  @ApiOperation({ summary: "Yeni site özelliği oluştur" })
  @ApiResponse({
    status: 201,
    description: "Özellik başarıyla oluşturuldu",
    type: SiteOzellik,
  })
  create(@Body() createDto: CreateSiteOzellikDto) {
    return this.siteOzellikleriService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: "Tüm site özelliklerini getir" })
  @ApiResponse({
    status: 200,
    description: "Özellik listesi",
    type: [SiteOzellik],
  })
  findAll() {
    return this.siteOzellikleriService.findAll();
  }

  @Get("sayfa/:sayfa")
  @ApiOperation({ summary: "Sayfaya göre özellikleri getir" })
  @ApiParam({ name: "sayfa", description: "Sayfa adı (anasayfa, hakkimizda, vb.)" })
  @ApiResponse({
    status: 200,
    description: "Özellik listesi",
    type: [SiteOzellik],
  })
  findBySayfa(@Param("sayfa") sayfa: string) {
    return this.siteOzellikleriService.findBySayfa(sayfa);
  }

  @Get(":id")
  @ApiOperation({ summary: "ID'ye göre özellik getir" })
  @ApiParam({ name: "id", description: "Özellik ID" })
  @ApiResponse({
    status: 200,
    description: "Özellik detayı",
    type: SiteOzellik,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.siteOzellikleriService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Özellik güncelle" })
  @ApiParam({ name: "id", description: "Özellik ID" })
  @ApiResponse({
    status: 200,
    description: "Özellik başarıyla güncellendi",
    type: SiteOzellik,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateSiteOzellikDto
  ) {
    return this.siteOzellikleriService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Özellik sil" })
  @ApiParam({ name: "id", description: "Özellik ID" })
  @ApiResponse({ status: 200, description: "Özellik başarıyla silindi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.siteOzellikleriService.remove(id);
  }
}

