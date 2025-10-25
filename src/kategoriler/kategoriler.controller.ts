import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { KategorilerService } from "./kategoriler.service";
import { CreateKategoriDto } from "./dto/create-kategori.dto";
import { UpdateKategoriDto } from "./dto/update-kategori.dto";
import { Kategori } from "./entities/kategori.entity";

@ApiTags("Kategoriler")
@Controller("kategoriler")
export class KategorilerController {
  constructor(private readonly kategorilerService: KategorilerService) {}

  @Post()
  @ApiOperation({ summary: "Yeni kategori oluştur" })
  @ApiResponse({
    status: 201,
    description: "Kategori başarıyla oluşturuldu",
    type: Kategori,
  })
  create(@Body() createKategoriDto: CreateKategoriDto) {
    return this.kategorilerService.create(createKategoriDto);
  }

  @Get()
  @ApiOperation({ summary: "Tüm kategorileri getir" })
  @ApiResponse({ status: 200, description: "Kategori listesi", type: [Kategori] })
  findAll() {
    return this.kategorilerService.findAll();
  }

  @Get("hizmet/:hizmetId")
  @ApiOperation({ summary: "Hizmete göre kategorileri getir" })
  @ApiParam({ name: "hizmetId", description: "Hizmet ID" })
  @ApiResponse({ status: 200, description: "Kategori listesi", type: [Kategori] })
  findByHizmetId(@Param("hizmetId", ParseIntPipe) hizmetId: number) {
    return this.kategorilerService.findByHizmetId(hizmetId);
  }

  @Get("hizmet-slug/:slug")
  @ApiOperation({ summary: "Hizmet slug'ına göre kategorileri getir" })
  @ApiParam({ name: "slug", description: "Hizmet slug (örn: stays, cars)" })
  @ApiResponse({ status: 200, description: "Kategori listesi", type: [Kategori] })
  findByHizmetSlug(@Param("slug") slug: string) {
    return this.kategorilerService.findByHizmetSlug(slug);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Slug'a göre kategori getir" })
  @ApiParam({ name: "slug", description: "Kategori slug" })
  @ApiQuery({
    name: "hizmetId",
    description: "Hizmet ID (opsiyonel)",
    required: false,
  })
  @ApiResponse({ status: 200, description: "Kategori detayı", type: Kategori })
  findBySlug(
    @Param("slug") slug: string,
    @Query("hizmetId") hizmetId?: number
  ) {
    return this.kategorilerService.findBySlug(slug, hizmetId);
  }

  @Get(":id")
  @ApiOperation({ summary: "ID'ye göre kategori getir" })
  @ApiParam({ name: "id", description: "Kategori ID" })
  @ApiResponse({ status: 200, description: "Kategori detayı", type: Kategori })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.kategorilerService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Kategori güncelle" })
  @ApiParam({ name: "id", description: "Kategori ID" })
  @ApiResponse({
    status: 200,
    description: "Kategori başarıyla güncellendi",
    type: Kategori,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateKategoriDto: UpdateKategoriDto
  ) {
    return this.kategorilerService.update(id, updateKategoriDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Kategori sil" })
  @ApiParam({ name: "id", description: "Kategori ID" })
  @ApiResponse({ status: 200, description: "Kategori başarıyla silindi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.kategorilerService.remove(id);
  }

  @Patch(":id/soft-delete")
  @ApiOperation({ summary: "Kategori pasif yap (soft delete)" })
  @ApiParam({ name: "id", description: "Kategori ID" })
  @ApiResponse({
    status: 200,
    description: "Kategori pasif yapıldı",
    type: Kategori,
  })
  softRemove(@Param("id", ParseIntPipe) id: number) {
    return this.kategorilerService.softRemove(id);
  }
}

