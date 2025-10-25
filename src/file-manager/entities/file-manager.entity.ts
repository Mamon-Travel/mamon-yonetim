import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('file_manager')
export class FileManager {
  @ApiProperty({ description: 'Dosya ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Dosya adı' })
  @Column({ type: 'varchar', length: 255 })
  dosya_adi: string;

  @ApiProperty({ description: 'Orijinal dosya adı' })
  @Column({ type: 'varchar', length: 255 })
  orijinal_dosya_adi: string;

  @ApiProperty({ description: 'Dosya yolu' })
  @Column({ type: 'varchar', length: 500 })
  dosya_yolu: string;

  @ApiProperty({ description: 'Dosya tipi (MIME type)' })
  @Column({ type: 'varchar', length: 100 })
  dosya_tipi: string;

  @ApiProperty({ description: 'Dosya boyutu (byte)' })
  @Column({ type: 'bigint' })
  dosya_boyutu: number;

  @ApiProperty({ description: 'Dosya kategorisi' })
  @Column({ type: 'varchar', length: 50 })
  kategori: string; // image, document, video, audio, other

  @ApiProperty({ description: 'Dosya açıklaması', required: false })
  @Column({ type: 'text', nullable: true })
  aciklama?: string;

  @ApiProperty({ description: 'Dosya etiketleri', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  etiketler?: string;

  @ApiProperty({ description: 'Yükleyen kullanıcı ID' })
  @Column({ type: 'integer' })
  yukleyen_kullanici_id: number;

  @ApiProperty({ description: 'Görüntüleme sayısı' })
  @Column({ type: 'integer', default: 0 })
  goruntuleme_sayisi: number;

  @ApiProperty({ description: 'İndirme sayısı' })
  @Column({ type: 'integer', default: 0 })
  indirme_sayisi: number;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)' })
  @Column({ type: 'smallint', default: 1 })
  durum: number;

  @ApiProperty({ description: 'Oluşturma tarihi' })
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  @UpdateDateColumn()
  guncelleme_tarihi: Date;
}

