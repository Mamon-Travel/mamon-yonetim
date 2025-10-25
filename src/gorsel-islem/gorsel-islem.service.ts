import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface GorselDonusumSecenekleri {
  genislik?: number;
  yukseklik?: number;
  kalite?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotate?: number;
  blur?: number;
  sharpen?: boolean;
  grayscale?: boolean;
}

export interface GorselIslemSonuc {
  orijinal_url: string;
  jpeg_url?: string;
  webp_url?: string;
  avif_url?: string;
  thumbnail_url?: string;
  genislik: number;
  yukseklik: number;
  dosya_boyutu: number;
  format: string;
}

@Injectable()
export class GorselIslemService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory() {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async processImage(
    buffer: Buffer,
    dosyaAdi: string,
    secenek?: GorselDonusumSecenekleri,
  ): Promise<GorselIslemSonuc> {
    const timestamp = Date.now();
    const ext = path.extname(dosyaAdi);
    const baseName = path.basename(dosyaAdi, ext);
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');

    let image = sharp(buffer);

    // Metadata al
    const metadata = await image.metadata();

    // İşlemler
    if (secenek?.crop) {
      image = image.extract({
        left: secenek.crop.x,
        top: secenek.crop.y,
        width: secenek.crop.width,
        height: secenek.crop.height,
      });
    }

    if (secenek?.genislik || secenek?.yukseklik) {
      image = image.resize(secenek.genislik, secenek.yukseklik, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    if (secenek?.rotate) {
      image = image.rotate(secenek.rotate);
    }

    if (secenek?.blur) {
      image = image.blur(secenek.blur);
    }

    if (secenek?.sharpen) {
      image = image.sharpen();
    }

    if (secenek?.grayscale) {
      image = image.grayscale();
    }

    const sonuc: GorselIslemSonuc = {
      orijinal_url: '',
      genislik: metadata.width || 0,
      yukseklik: metadata.height || 0,
      dosya_boyutu: 0,
      format: metadata.format || 'jpeg',
    };

    // Orijinal format (JPEG)
    const jpegPath = path.join(
      this.uploadPath,
      `${safeBaseName}-${timestamp}.jpg`,
    );
    await image
      .clone()
      .jpeg({ quality: secenek?.kalite || 90 })
      .toFile(jpegPath);
    sonuc.orijinal_url = `/uploads/${path.basename(jpegPath)}`;
    const jpegStats = await fs.stat(jpegPath);
    sonuc.dosya_boyutu = jpegStats.size;

    // WebP format (modern, küçük boyut)
    const webpPath = path.join(
      this.uploadPath,
      `${safeBaseName}-${timestamp}.webp`,
    );
    await image
      .clone()
      .webp({ quality: secenek?.kalite || 90 })
      .toFile(webpPath);
    sonuc.webp_url = `/uploads/${path.basename(webpPath)}`;

    // AVIF format (en modern, en küçük boyut)
    const avifPath = path.join(
      this.uploadPath,
      `${safeBaseName}-${timestamp}.avif`,
    );
    await image
      .clone()
      .avif({ quality: secenek?.kalite || 90 })
      .toFile(avifPath);
    sonuc.avif_url = `/uploads/${path.basename(avifPath)}`;

    // Thumbnail (küçük önizleme)
    const thumbnailPath = path.join(
      this.uploadPath,
      `${safeBaseName}-${timestamp}-thumb.jpg`,
    );
    await image
      .clone()
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
    sonuc.thumbnail_url = `/uploads/${path.basename(thumbnailPath)}`;

    return sonuc;
  }

  async deleteImage(dosyaYolu: string): Promise<void> {
    try {
      const fullPath = path.join(process.cwd(), dosyaYolu);
      await fs.unlink(fullPath);

      // İlgili formatları da sil
      const baseName = path.basename(dosyaYolu, path.extname(dosyaYolu));
      const dirName = path.dirname(fullPath);

      const relatedFiles = [
        `${baseName}.webp`,
        `${baseName}.avif`,
        `${baseName}-thumb.jpg`,
      ];

      for (const file of relatedFiles) {
        try {
          await fs.unlink(path.join(dirName, file));
        } catch (err) {
          // Dosya yoksa sorun yok
        }
      }
    } catch (error) {
      console.error('Görsel silinirken hata:', error);
    }
  }

  async optimizeImage(
    inputPath: string,
    kalite: number = 90,
  ): Promise<string> {
    const timestamp = Date.now();
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const outputPath = path.join(
      this.uploadPath,
      `${baseName}-optimized-${timestamp}${ext}`,
    );

    await sharp(inputPath)
      .jpeg({ quality: kalite, progressive: true })
      .toFile(outputPath);

    return `/uploads/${path.basename(outputPath)}`;
  }

  async createSocialMediaImage(
    baslik: string,
    aciklama: string,
    arkaplanRengi: string = '#1E40AF',
    logoPath?: string,
  ): Promise<string> {
    const width = 1200;
    const height = 630; // Open Graph standart boyut

    // SVG ile metin oluştur
    const svg = `
      <svg width="${width}" height="${height}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${arkaplanRengi};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.darkenColor(arkaplanRengi)};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)"/>
        <text x="60" y="200" font-family="Arial, sans-serif" font-size="54" font-weight="bold" fill="white">
          ${this.escapeXml(baslik.substring(0, 50))}
        </text>
        <text x="60" y="280" font-family="Arial, sans-serif" font-size="28" fill="#E5E7EB">
          ${this.escapeXml(aciklama.substring(0, 100))}
        </text>
      </svg>
    `;

    const timestamp = Date.now();
    const outputPath = path.join(
      this.uploadPath,
      `social-${timestamp}.jpg`,
    );

    await sharp(Buffer.from(svg))
      .resize(width, height)
      .jpeg({ quality: 95 })
      .toFile(outputPath);

    return `/uploads/${path.basename(outputPath)}`;
  }

  private darkenColor(color: string): string {
    // Basit renk koyulaştırma (hex)
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`;
    }
    return color;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

