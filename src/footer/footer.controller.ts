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
import { FooterService } from "./footer.service";
import { CreateFooterMenuDto } from "./dto/create-footer-menu.dto";
import { UpdateFooterMenuDto } from "./dto/update-footer-menu.dto";
import { CreateFooterAyarDto } from "./dto/create-footer-ayar.dto";
import { UpdateFooterAyarDto } from "./dto/update-footer-ayar.dto";
import { FooterMenu } from "./entities/footer-menu.entity";
import { FooterAyar } from "./entities/footer-ayar.entity";

@ApiTags("Footer")
@Controller("footer")
export class FooterController {
  constructor(private readonly footerService: FooterService) {}

  // ===== MENÜLER =====
  @Post("menuler")
  @ApiOperation({ summary: "Yeni footer menü oluştur" })
  @ApiResponse({ status: 201, type: FooterMenu })
  createMenu(@Body() createDto: CreateFooterMenuDto) {
    return this.footerService.createMenu(createDto);
  }

  @Get("menuler")
  @ApiOperation({ summary: "Tüm footer menüleri getir" })
  @ApiResponse({ status: 200, type: [FooterMenu] })
  findAllMenus() {
    return this.footerService.findAllMenus();
  }

  @Get("menuler/kategori/:kategori")
  @ApiOperation({ summary: "Kategoriye göre menüleri getir" })
  @ApiParam({ name: "kategori" })
  @ApiResponse({ status: 200, type: [FooterMenu] })
  findMenusByKategori(@Param("kategori") kategori: string) {
    return this.footerService.findMenusByKategori(kategori);
  }

  @Get("menuler/:id")
  @ApiOperation({ summary: "Menü detayı" })
  @ApiParam({ name: "id" })
  @ApiResponse({ status: 200, type: FooterMenu })
  findOneMenu(@Param("id", ParseIntPipe) id: number) {
    return this.footerService.findOneMenu(id);
  }

  @Patch("menuler/:id")
  @ApiOperation({ summary: "Menü güncelle" })
  @ApiParam({ name: "id" })
  @ApiResponse({ status: 200, type: FooterMenu })
  updateMenu(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateFooterMenuDto
  ) {
    return this.footerService.updateMenu(id, updateDto);
  }

  @Delete("menuler/:id")
  @ApiOperation({ summary: "Menü sil" })
  @ApiParam({ name: "id" })
  removeMenu(@Param("id", ParseIntPipe) id: number) {
    return this.footerService.removeMenu(id);
  }

  // ===== AYARLAR =====
  @Post("ayarlar")
  @ApiOperation({ summary: "Yeni footer ayar oluştur" })
  @ApiResponse({ status: 201, type: FooterAyar })
  createAyar(@Body() createDto: CreateFooterAyarDto) {
    return this.footerService.createAyar(createDto);
  }

  @Get("ayarlar")
  @ApiOperation({ summary: "Tüm footer ayarları getir" })
  @ApiResponse({ status: 200, type: [FooterAyar] })
  findAllAyarlar() {
    return this.footerService.findAllAyarlar();
  }

  @Get("ayarlar/:anahtar")
  @ApiOperation({ summary: "Ayar detayı" })
  @ApiParam({ name: "anahtar" })
  @ApiResponse({ status: 200, type: FooterAyar })
  findAyarByAnahtar(@Param("anahtar") anahtar: string) {
    return this.footerService.findAyarByAnahtar(anahtar);
  }

  @Patch("ayarlar/:anahtar")
  @ApiOperation({ summary: "Ayar güncelle" })
  @ApiParam({ name: "anahtar" })
  @ApiResponse({ status: 200, type: FooterAyar })
  updateAyar(
    @Param("anahtar") anahtar: string,
    @Body() updateDto: UpdateFooterAyarDto
  ) {
    return this.footerService.updateAyar(anahtar, updateDto);
  }

  @Delete("ayarlar/:anahtar")
  @ApiOperation({ summary: "Ayar sil" })
  @ApiParam({ name: "anahtar" })
  removeAyar(@Param("anahtar") anahtar: string) {
    return this.footerService.removeAyar(anahtar);
  }

  // ===== FULL DATA =====
  @Get("full")
  @ApiOperation({ summary: "Tüm footer verisini getir (menüler + ayarlar)" })
  @ApiResponse({ status: 200 })
  getFullFooterData() {
    return this.footerService.getFullFooterData();
  }
}

