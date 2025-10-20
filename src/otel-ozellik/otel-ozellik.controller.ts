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
import { OtelOzellikService } from "./otel-ozellik.service";
import { CreateOtelOzellikDto } from "./dto/create-otel-ozellik.dto";
import { UpdateOtelOzellikDto } from "./dto/update-otel-ozellik.dto";
import { OtelOzellik } from "./entities/otel-ozellik.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Otel Özellikleri")
@Controller("otel-ozellik")
export class OtelOzellikController {
  constructor(private readonly otelOzellikService: OtelOzellikService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Yeni otel özelliği oluştur" })
  @ApiResponse({
    status: 201,
    description: "Özellik başarıyla oluşturuldu",
    type: OtelOzellik,
  })
  create(
    @Body() createOtelOzellikDto: CreateOtelOzellikDto,
  ): Promise<OtelOzellik> {
    return this.otelOzellikService.create(createOtelOzellikDto);
  }

  @Get()
  @ApiOperation({ summary: "Tüm otel özelliklerini listele" })
  @ApiResponse({
    status: 200,
    description: "Özellikler listelendi",
    type: [OtelOzellik],
  })
  findAll(): Promise<OtelOzellik[]> {
    return this.otelOzellikService.findAll();
  }

  @Get("active")
  @ApiOperation({ summary: "Aktif otel özelliklerini listele" })
  @ApiResponse({
    status: 200,
    description: "Aktif özellikler listelendi",
    type: [OtelOzellik],
  })
  findActive(): Promise<OtelOzellik[]> {
    return this.otelOzellikService.findActive();
  }

  @Get(":id")
  @ApiOperation({ summary: "Otel özelliği detayını getir" })
  @ApiResponse({
    status: 200,
    description: "Özellik detayı",
    type: OtelOzellik,
  })
  @ApiResponse({ status: 404, description: "Özellik bulunamadı" })
  findOne(@Param("id") id: string): Promise<OtelOzellik> {
    return this.otelOzellikService.findOne(+id);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Otel özelliği güncelle" })
  @ApiResponse({
    status: 200,
    description: "Özellik güncellendi",
    type: OtelOzellik,
  })
  @ApiResponse({ status: 404, description: "Özellik bulunamadı" })
  update(
    @Param("id") id: string,
    @Body() updateOtelOzellikDto: UpdateOtelOzellikDto,
  ): Promise<OtelOzellik> {
    return this.otelOzellikService.update(+id, updateOtelOzellikDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Otel özelliği sil" })
  @ApiResponse({ status: 204, description: "Özellik silindi" })
  @ApiResponse({ status: 404, description: "Özellik bulunamadı" })
  remove(@Param("id") id: string): Promise<void> {
    return this.otelOzellikService.remove(+id);
  }
}

