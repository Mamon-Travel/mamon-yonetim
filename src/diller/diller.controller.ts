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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { DillerService } from "./diller.service";
import { CreateDilDto } from "./dto/create-dil.dto";
import { UpdateDilDto } from "./dto/update-dil.dto";
import { Dil } from "./entities/dil.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Diller")
@Controller("diller")
export class DillerController {
  constructor(private readonly dillerService: DillerService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Yeni dil ekle" })
  @ApiResponse({ status: 201, description: "Dil oluşturuldu", type: Dil })
  create(@Body() createDilDto: CreateDilDto): Promise<Dil> {
    return this.dillerService.create(createDilDto);
  }

  @Get()
  @ApiOperation({ summary: "Tüm dilleri listele" })
  @ApiResponse({ status: 200, description: "Dil listesi", type: [Dil] })
  findAll(): Promise<Dil[]> {
    return this.dillerService.findAll();
  }

  @Get("active")
  @ApiOperation({ summary: "Aktif dilleri listele" })
  @ApiResponse({ status: 200, description: "Aktif dil listesi", type: [Dil] })
  findActive(): Promise<Dil[]> {
    return this.dillerService.findActive();
  }

  @Get("default")
  @ApiOperation({ summary: "Varsayılan dili getir" })
  @ApiResponse({ status: 200, description: "Varsayılan dil", type: Dil })
  findDefault(): Promise<Dil> {
    return this.dillerService.findDefault();
  }

  @Get("kod/:kod")
  @ApiOperation({ summary: "Dil koduna göre dil getir" })
  @ApiResponse({ status: 200, description: "Dil detayı", type: Dil })
  findByKod(@Param("kod") kod: string): Promise<Dil> {
    return this.dillerService.findByKod(kod);
  }

  @Get(":id")
  @ApiOperation({ summary: "Dil detayını getir" })
  @ApiResponse({ status: 200, description: "Dil detayı", type: Dil })
  findOne(@Param("id") id: string): Promise<Dil> {
    return this.dillerService.findOne(+id);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Dil güncelle" })
  @ApiResponse({ status: 200, description: "Dil güncellendi", type: Dil })
  update(@Param("id") id: string, @Body() updateDilDto: UpdateDilDto): Promise<Dil> {
    return this.dillerService.update(+id, updateDilDto);
  }

  @Patch(":id/set-default")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Dili varsayılan olarak ayarla" })
  @ApiResponse({ status: 200, description: "Varsayılan dil ayarlandı", type: Dil })
  setDefault(@Param("id") id: string): Promise<Dil> {
    return this.dillerService.setDefault(+id);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Dil sil" })
  @ApiResponse({ status: 204, description: "Dil silindi" })
  remove(@Param("id") id: string): Promise<void> {
    return this.dillerService.remove(+id);
  }
}









