import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateContentDto } from './dto/generate-content.dto';
import { GenerateOtelContentDto } from './dto/generate-otel-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI İçerik Oluşturma')
@Controller('ai')
// @ApiBearerAuth()  // TEST İÇİN GEÇİCİ OLARAK KAPALI
// @UseGuards(JwtAuthGuard)  // TEST İÇİN GEÇİCİ OLARAK KAPALI
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Genel içerik oluştur' })
  @ApiResponse({
    status: 200,
    description: 'İçerik başarıyla oluşturuldu',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 503, description: 'AI servisi kullanılamıyor' })
  async generateContent(
    @Body() dto: GenerateContentDto,
  ): Promise<{ content: string }> {
    const content = await this.aiService.generateContent(dto);
    return { content };
  }

  @Post('otel/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Otel için içerik oluştur' })
  @ApiResponse({
    status: 200,
    description: 'Otel içeriği başarıyla oluşturuldu',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
      },
    },
  })
  async generateOtelContent(
    @Body() dto: GenerateOtelContentDto,
  ): Promise<{ content: string }> {
    const content = await this.aiService.generateOtelContent(dto);
    return { content };
  }

  @Post('otel/generate-multiple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Otel için toplu içerik oluştur (kısa + uzun açıklama)' })
  @ApiResponse({
    status: 200,
    description: 'Otel içerikleri başarıyla oluşturuldu',
    schema: {
      type: 'object',
      properties: {
        kisaAciklama: { type: 'string' },
        uzunAciklama: { type: 'string' },
      },
    },
  })
  async generateMultipleOtelContent(
    @Body() dto: Omit<GenerateOtelContentDto, 'contentType'>,
  ): Promise<{ kisaAciklama: string; uzunAciklama: string }> {
    return this.aiService.generateMultipleOtelContent(dto);
  }

  @Post('improve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Metni iyileştir' })
  @ApiResponse({
    status: 200,
    description: 'Metin başarıyla iyileştirildi',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
      },
    },
  })
  async improveText(
    @Body() body: { text: string; instructions?: string },
  ): Promise<{ content: string }> {
    const content = await this.aiService.improveText(
      body.text,
      body.instructions,
    );
    return { content };
  }

  @Post('summarize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Metni özetle' })
  @ApiResponse({
    status: 200,
    description: 'Metin başarıyla özetlendi',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
      },
    },
  })
  async summarizeText(
    @Body() body: { text: string; maxLength?: number },
  ): Promise<{ content: string }> {
    const content = await this.aiService.summarizeText(
      body.text,
      body.maxLength,
    );
    return { content };
  }

  @Post('keywords')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SEO anahtar kelimeleri öner' })
  @ApiResponse({
    status: 200,
    description: 'Anahtar kelimeler başarıyla oluşturuldu',
    schema: {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  async suggestKeywords(
    @Body() body: { otelAdi: string; sehir?: string; konsept?: string },
  ): Promise<{ keywords: string[] }> {
    const keywords = await this.aiService.suggestKeywords(
      body.otelAdi,
      body.sehir,
      body.konsept,
    );
    return { keywords };
  }
}

