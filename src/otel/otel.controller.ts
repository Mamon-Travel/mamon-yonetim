import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { OtelService } from "./otel.service";
import { CreateOtelDto } from "./dto/create-otel.dto";
import { UpdateOtelDto } from "./dto/update-otel.dto";
import { CreateOdaTipiDto } from "./dto/create-oda-tipi.dto";
import { UpdateOdaTipiDto } from "./dto/update-oda-tipi.dto";
import { UploadGorselDto } from "./dto/upload-gorsel.dto";
import { Otel } from "./entities/otel.entity";
import { OtelOdaTipi } from "./entities/otel-oda-tipi.entity";
import { OtelGorsel } from "./entities/otel-gorsel.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Oteller")
@Controller("otel")
export class OtelController {
  constructor(private readonly otelService: OtelService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Yeni otel oluştur" })
  @ApiResponse({
    status: 201,
    description: "Otel başarıyla oluşturuldu",
    type: Otel,
  })
  create(@Body() createOtelDto: CreateOtelDto): Promise<Otel> {
    return this.otelService.create(createOtelDto);
  }

  @Get()
  @ApiOperation({ summary: "Tüm otelleri listele" })
  @ApiResponse({
    status: 200,
    description: "Oteller listelendi",
    type: [Otel],
  })
  findAll(): Promise<Otel[]> {
    return this.otelService.findAll();
  }

  @Get("active")
  @ApiOperation({ summary: "Aktif otelleri listele" })
  @ApiResponse({
    status: 200,
    description: "Aktif oteller listelendi",
    type: [Otel],
  })
  findActive(): Promise<Otel[]> {
    return this.otelService.findActive();
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Slug ile otel getir" })
  @ApiResponse({
    status: 200,
    description: "Otel detayı",
    type: Otel,
  })
  @ApiResponse({ status: 404, description: "Otel bulunamadı" })
  findBySlug(@Param("slug") slug: string): Promise<Otel> {
    return this.otelService.findBySlug(slug);
  }

  @Get(":id")
  @ApiOperation({ summary: "Otel detayını getir" })
  @ApiResponse({
    status: 200,
    description: "Otel detayı",
    type: Otel,
  })
  @ApiResponse({ status: 404, description: "Otel bulunamadı" })
  findOne(@Param("id") id: string): Promise<Otel> {
    return this.otelService.findOne(+id);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Otel güncelle" })
  @ApiResponse({
    status: 200,
    description: "Otel güncellendi",
    type: Otel,
  })
  @ApiResponse({ status: 404, description: "Otel bulunamadı" })
  update(
    @Param("id") id: string,
    @Body() updateOtelDto: UpdateOtelDto,
  ): Promise<Otel> {
    return this.otelService.update(+id, updateOtelDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Otel sil" })
  @ApiResponse({ status: 204, description: "Otel silindi" })
  @ApiResponse({ status: 404, description: "Otel bulunamadı" })
  remove(@Param("id") id: string): Promise<void> {
    return this.otelService.remove(+id);
  }

  // Oda Tipi endpoints
  @Post(":otelId/oda-tipi")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Yeni oda tipi oluştur" })
  @ApiResponse({
    status: 201,
    description: "Oda tipi başarıyla oluşturuldu",
    type: OtelOdaTipi,
  })
  createOdaTipi(@Body() createOdaTipiDto: CreateOdaTipiDto): Promise<OtelOdaTipi> {
    return this.otelService.createOdaTipi(createOdaTipiDto);
  }

  @Get(":otelId/oda-tipi")
  @ApiOperation({ summary: "Otelin oda tiplerini listele" })
  @ApiResponse({
    status: 200,
    description: "Oda tipleri listelendi",
    type: [OtelOdaTipi],
  })
  findOdaTipleri(@Param("otelId") otelId: string): Promise<OtelOdaTipi[]> {
    return this.otelService.findOdaTipleriByOtelId(+otelId);
  }

  @Get("oda-tipi/:id")
  @ApiOperation({ summary: "Oda tipi detayı" })
  @ApiResponse({
    status: 200,
    description: "Oda tipi detayı",
    type: OtelOdaTipi,
  })
  @ApiResponse({ status: 404, description: "Oda tipi bulunamadı" })
  findOneOdaTipi(@Param("id") id: string): Promise<OtelOdaTipi> {
    return this.otelService.findOneOdaTipi(+id);
  }

  @Patch("oda-tipi/:id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Oda tipi güncelle" })
  @ApiResponse({
    status: 200,
    description: "Oda tipi güncellendi",
    type: OtelOdaTipi,
  })
  @ApiResponse({ status: 404, description: "Oda tipi bulunamadı" })
  updateOdaTipi(
    @Param("id") id: string,
    @Body() updateOdaTipiDto: UpdateOdaTipiDto,
  ): Promise<OtelOdaTipi> {
    return this.otelService.updateOdaTipi(+id, updateOdaTipiDto);
  }

  @Delete("oda-tipi/:id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Oda tipi sil" })
  @ApiResponse({ status: 204, description: "Oda tipi silindi" })
  @ApiResponse({ status: 404, description: "Oda tipi bulunamadı" })
  removeOdaTipi(@Param("id") id: string): Promise<void> {
    return this.otelService.removeOdaTipi(+id);
  }

  // Görsel endpoints
  @Post(":otelId/gorsel")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Otel görseli yükle" })
  @ApiResponse({
    status: 201,
    description: "Görsel başarıyla yüklendi",
    type: OtelGorsel,
  })
  uploadGorsel(@Body() uploadGorselDto: UploadGorselDto): Promise<OtelGorsel> {
    return this.otelService.uploadGorsel(uploadGorselDto);
  }

  @Get(":otelId/gorsel")
  @ApiOperation({ summary: "Otel görsellerini listele" })
  @ApiResponse({
    status: 200,
    description: "Görseller listelendi",
    type: [OtelGorsel],
  })
  getOtelGorselleri(@Param("otelId") otelId: string): Promise<OtelGorsel[]> {
    return this.otelService.getOtelGorselleri(+otelId);
  }

  @Delete("gorsel/:id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Otel görseli sil" })
  @ApiResponse({ status: 204, description: "Görsel silindi" })
  @ApiResponse({ status: 404, description: "Görsel bulunamadı" })
  deleteGorsel(@Param("id") id: string): Promise<void> {
    return this.otelService.deleteGorsel(+id);
  }

  @Patch("gorsel/:id/sira")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Görsel sırasını güncelle" })
  @ApiResponse({
    status: 200,
    description: "Sıra güncellendi",
    type: OtelGorsel,
  })
  updateGorselSira(
    @Param("id") id: string,
    @Body("sira") sira: number
  ): Promise<OtelGorsel> {
    return this.otelService.updateGorselSira(+id, sira);
  }
}

