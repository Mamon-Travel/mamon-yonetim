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
import { OtelOdaOzellikService } from "./otel-oda-ozellik.service";
import { CreateOtelOdaOzellikDto } from "./dto/create-otel-oda-ozellik.dto";
import { UpdateOtelOdaOzellikDto } from "./dto/update-otel-oda-ozellik.dto";
import { OtelOdaOzellik } from "./entities/otel-oda-ozellik.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Otel Oda Özellikleri")
@Controller("otel-oda-ozellik")
export class OtelOdaOzellikController {
  constructor(
    private readonly otelOdaOzellikService: OtelOdaOzellikService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Yeni oda özelliği oluştur" })
  @ApiResponse({
    status: 201,
    description: "Özellik başarıyla oluşturuldu",
    type: OtelOdaOzellik,
  })
  create(
    @Body() createOtelOdaOzellikDto: CreateOtelOdaOzellikDto,
  ): Promise<OtelOdaOzellik> {
    return this.otelOdaOzellikService.create(createOtelOdaOzellikDto);
  }

  @Get()
  @ApiOperation({ summary: "Tüm oda özelliklerini listele" })
  @ApiResponse({
    status: 200,
    description: "Özellikler listelendi",
    type: [OtelOdaOzellik],
  })
  findAll(): Promise<OtelOdaOzellik[]> {
    return this.otelOdaOzellikService.findAll();
  }

  @Get("active")
  @ApiOperation({ summary: "Aktif oda özelliklerini listele" })
  @ApiResponse({
    status: 200,
    description: "Aktif özellikler listelendi",
    type: [OtelOdaOzellik],
  })
  findActive(): Promise<OtelOdaOzellik[]> {
    return this.otelOdaOzellikService.findActive();
  }

  @Get(":id")
  @ApiOperation({ summary: "Oda özelliği detayını getir" })
  @ApiResponse({
    status: 200,
    description: "Özellik detayı",
    type: OtelOdaOzellik,
  })
  @ApiResponse({ status: 404, description: "Özellik bulunamadı" })
  findOne(@Param("id") id: string): Promise<OtelOdaOzellik> {
    return this.otelOdaOzellikService.findOne(+id);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Oda özelliği güncelle" })
  @ApiResponse({
    status: 200,
    description: "Özellik güncellendi",
    type: OtelOdaOzellik,
  })
  @ApiResponse({ status: 404, description: "Özellik bulunamadı" })
  update(
    @Param("id") id: string,
    @Body() updateOtelOdaOzellikDto: UpdateOtelOdaOzellikDto,
  ): Promise<OtelOdaOzellik> {
    return this.otelOdaOzellikService.update(+id, updateOtelOdaOzellikDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Oda özelliği sil" })
  @ApiResponse({ status: 204, description: "Özellik silindi" })
  @ApiResponse({ status: 404, description: "Özellik bulunamadı" })
  remove(@Param("id") id: string): Promise<void> {
    return this.otelOdaOzellikService.remove(+id);
  }
}

