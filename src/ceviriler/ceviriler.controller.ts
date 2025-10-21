import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CevirilerService } from "./ceviriler.service";
import { CreateCeviriDto } from "./dto/create-ceviri.dto";
import { UpdateCeviriDto } from "./dto/update-ceviri.dto";
import { Ceviri } from "./entities/ceviri.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Çeviriler")
@Controller("ceviriler")
export class CevirilerController {
  constructor(private readonly cevirilerService: CevirilerService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Yeni çeviri ekle" })
  @ApiResponse({ status: 201, description: "Çeviri oluşturuldu", type: Ceviri })
  create(@Body() createCeviriDto: CreateCeviriDto): Promise<Ceviri> {
    return this.cevirilerService.create(createCeviriDto);
  }

  @Post("bulk")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Toplu çeviri ekle" })
  @ApiResponse({ status: 201, description: "Çeviriler oluşturuldu", type: [Ceviri] })
  createBulk(@Body() ceviriler: CreateCeviriDto[]): Promise<Ceviri[]> {
    return this.cevirilerService.createBulk(ceviriler);
  }

  @Get()
  @ApiOperation({ summary: "Tüm çevirileri listele" })
  @ApiResponse({ status: 200, description: "Çeviri listesi", type: [Ceviri] })
  findAll(): Promise<Ceviri[]> {
    return this.cevirilerService.findAll();
  }

  @Get("dil/:dilId")
  @ApiOperation({ summary: "Dile göre çevirileri listele" })
  @ApiResponse({ status: 200, description: "Çeviri listesi", type: [Ceviri] })
  findByDilId(@Param("dilId") dilId: string): Promise<Ceviri[]> {
    return this.cevirilerService.findByDilId(+dilId);
  }

  @Get("dil-kod/:dilKod")
  @ApiOperation({ summary: "Dil koduna göre çevirileri listele" })
  @ApiResponse({ status: 200, description: "Çeviri listesi", type: [Ceviri] })
  findByDilKod(@Param("dilKod") dilKod: string): Promise<Ceviri[]> {
    return this.cevirilerService.findByDilKod(dilKod);
  }

  @Get("dil-kod/:dilKod/object")
  @ApiOperation({ summary: "Dil koduna göre çevirileri obje olarak getir" })
  @ApiResponse({ status: 200, description: "Çeviri objesi" })
  getTranslationsObject(@Param("dilKod") dilKod: string): Promise<Record<string, string>> {
    return this.cevirilerService.getTranslationsObject(dilKod);
  }

  @Get("kategori/:kategori")
  @ApiOperation({ summary: "Kategoriye göre çevirileri listele" })
  @ApiResponse({ status: 200, description: "Çeviri listesi", type: [Ceviri] })
  findByKategori(@Param("kategori") kategori: string): Promise<Ceviri[]> {
    return this.cevirilerService.findByKategori(kategori);
  }

  @Get("dil/:dilId/kategori/:kategori")
  @ApiOperation({ summary: "Dil ve kategoriye göre çevirileri listele" })
  @ApiResponse({ status: 200, description: "Çeviri listesi", type: [Ceviri] })
  findByDilAndKategori(
    @Param("dilId") dilId: string,
    @Param("kategori") kategori: string
  ): Promise<Ceviri[]> {
    return this.cevirilerService.findByDilAndKategori(+dilId, kategori);
  }

  @Get("dil/:dilId/kategoriler")
  @ApiOperation({ summary: "Dile göre kategorileri listele" })
  @ApiResponse({ status: 200, description: "Kategori listesi" })
  getKategorilerByDilId(@Param("dilId") dilId: string): Promise<string[]> {
    return this.cevirilerService.getKategorilerByDilId(+dilId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Çeviri detayını getir" })
  @ApiResponse({ status: 200, description: "Çeviri detayı", type: Ceviri })
  findOne(@Param("id") id: string): Promise<Ceviri> {
    return this.cevirilerService.findOne(+id);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Çeviri güncelle" })
  @ApiResponse({ status: 200, description: "Çeviri güncellendi", type: Ceviri })
  update(@Param("id") id: string, @Body() updateCeviriDto: UpdateCeviriDto): Promise<Ceviri> {
    return this.cevirilerService.update(+id, updateCeviriDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Çeviri sil" })
  @ApiResponse({ status: 204, description: "Çeviri silindi" })
  remove(@Param("id") id: string): Promise<void> {
    return this.cevirilerService.remove(+id);
  }
}


