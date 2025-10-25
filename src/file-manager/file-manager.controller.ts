import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileManagerService } from './file-manager.service';
import { CreateFileManagerDto } from './dto/create-file-manager.dto';
import { UpdateFileManagerDto } from './dto/update-file-manager.dto';
import { FileManager } from './entities/file-manager.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('File Manager')
@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {
    // Uploads klasörünü oluştur
    const uploadsDir = path.join(process.cwd(), 'uploads', 'files');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  @Post('upload')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Dosya yükle' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        kategori: {
          type: 'string',
          example: 'image',
        },
        aciklama: {
          type: 'string',
        },
        etiketler: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/files',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `file-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('kategori') kategori: string,
    @Body('aciklama') aciklama?: string,
    @Body('etiketler') etiketler?: string,
    @CurrentUser() user?: any,
  ) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenmedi');
    }

    // Dosya tipine göre kategori belirle
    let fileCategory = kategori || 'other';
    if (!kategori) {
      if (file.mimetype.startsWith('image/')) {
        fileCategory = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        fileCategory = 'video';
      } else if (file.mimetype.startsWith('audio/')) {
        fileCategory = 'audio';
      } else if (
        file.mimetype.includes('pdf') ||
        file.mimetype.includes('word') ||
        file.mimetype.includes('excel') ||
        file.mimetype.includes('spreadsheet') ||
        file.mimetype.includes('presentation')
      ) {
        fileCategory = 'document';
      }
    }

    const filePath = `/uploads/files/${file.filename}`;

    const createDto: CreateFileManagerDto = {
      dosya_adi: file.filename,
      orijinal_dosya_adi: file.originalname,
      dosya_yolu: filePath,
      dosya_tipi: file.mimetype,
      dosya_boyutu: file.size,
      kategori: fileCategory,
      aciklama: aciklama,
      etiketler: etiketler,
      yukleyen_kullanici_id: user?.id || 1,
    };

    return await this.fileManagerService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm dosyaları listele' })
  @ApiResponse({ status: 200, description: 'Dosyalar listelendi', type: [FileManager] })
  findAll(@Query('kategori') kategori?: string) {
    if (kategori) {
      return this.fileManagerService.findByCategory(kategori);
    }
    return this.fileManagerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Dosya detayını getir' })
  @ApiResponse({ status: 200, description: 'Dosya detayı', type: FileManager })
  @ApiResponse({ status: 404, description: 'Dosya bulunamadı' })
  async findOne(@Param('id') id: string) {
    const file = await this.fileManagerService.findOne(+id);
    await this.fileManagerService.incrementViewCount(+id);
    return file;
  }

  @Patch(':id')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Dosya bilgilerini güncelle' })
  @ApiResponse({ status: 200, description: 'Dosya güncellendi', type: FileManager })
  @ApiResponse({ status: 404, description: 'Dosya bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateFileManagerDto: UpdateFileManagerDto,
  ) {
    return this.fileManagerService.update(+id, updateFileManagerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Dosyayı sil' })
  @ApiResponse({ status: 204, description: 'Dosya silindi' })
  @ApiResponse({ status: 404, description: 'Dosya bulunamadı' })
  remove(@Param('id') id: string) {
    return this.fileManagerService.remove(+id);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Dosya indirme sayacını artır' })
  async incrementDownload(@Param('id') id: string) {
    await this.fileManagerService.incrementDownloadCount(+id);
    return { success: true };
  }
}

