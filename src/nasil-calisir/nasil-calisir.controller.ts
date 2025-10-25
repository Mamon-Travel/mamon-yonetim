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
import { NasilCalisirService } from "./nasil-calisir.service";
import { CreateNasilCalisirDto } from "./dto/create-nasil-calisir.dto";
import { UpdateNasilCalisirDto } from "./dto/update-nasil-calisir.dto";
import { NasilCalisir } from "./entities/nasil-calisir.entity";

@ApiTags("Nasıl Çalışır")
@Controller("nasil-calisir")
export class NasilCalisirController {
  constructor(private readonly nasilCalisirService: NasilCalisirService) {}

  @Post()
  @ApiOperation({ summary: "Yeni adım oluştur" })
  @ApiResponse({
    status: 201,
    description: "Adım başarıyla oluşturuldu",
    type: NasilCalisir,
  })
  create(@Body() createDto: CreateNasilCalisirDto) {
    return this.nasilCalisirService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: "Tüm adımları getir" })
  @ApiResponse({
    status: 200,
    description: "Adım listesi",
    type: [NasilCalisir],
  })
  findAll() {
    return this.nasilCalisirService.findAll();
  }

  @Get("sayfa/:sayfa")
  @ApiOperation({ summary: "Sayfaya göre adımları getir" })
  @ApiParam({ name: "sayfa", description: "Sayfa adı" })
  @ApiResponse({
    status: 200,
    description: "Adım listesi",
    type: [NasilCalisir],
  })
  findBySayfa(@Param("sayfa") sayfa: string) {
    return this.nasilCalisirService.findBySayfa(sayfa);
  }

  @Get(":id")
  @ApiOperation({ summary: "ID'ye göre adım getir" })
  @ApiParam({ name: "id", description: "Adım ID" })
  @ApiResponse({
    status: 200,
    description: "Adım detayı",
    type: NasilCalisir,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.nasilCalisirService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Adım güncelle" })
  @ApiParam({ name: "id", description: "Adım ID" })
  @ApiResponse({
    status: 200,
    description: "Adım başarıyla güncellendi",
    type: NasilCalisir,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateNasilCalisirDto
  ) {
    return this.nasilCalisirService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Adım sil" })
  @ApiParam({ name: "id", description: "Adım ID" })
  @ApiResponse({ status: 200, description: "Adım başarıyla silindi" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.nasilCalisirService.remove(id);
  }
}

