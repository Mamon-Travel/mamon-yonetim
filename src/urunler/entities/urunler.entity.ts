import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Hizmetler } from '../../hizmetler/entities/hizmetler.entity';

export enum FiyatTipi {
  GUNLUK = 'gunluk',
  GECE = 'gece',
  SAAT = 'saat',
  ADET = 'adet',
  KISI = 'kisi',
}

export enum StokDurumu {
  MEVCUT = 'mevcut',
  TUKENDI = 'tukendi',
  REZERVE = 'rezerve',
}

@Entity('urunler')
export class Urunler {
  @ApiProperty({ description: 'Ürün ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Hizmet ID' })
  @Column({ type: 'int' })
  hizmet_id: number;

  @ApiProperty({ description: 'Ürün başlığı', example: 'Deluxe Oda' })
  @Column({ type: 'varchar', length: 255 })
  baslik: string;

  @ApiProperty({ description: 'URL dostu slug', example: 'deluxe-oda' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  slug: string;

  @ApiProperty({ description: 'Ürün açıklaması' })
  @Column({ type: 'text', nullable: true })
  aciklama: string;

  @ApiProperty({ description: 'Ana resim URL' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  ana_resim: string;

  @ApiProperty({ description: 'Diğer resimler (JSON array)' })
  @Column({ type: 'json', nullable: true })
  resimler: string[];

  @ApiProperty({ description: 'Fiyat' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fiyat: number;

  @ApiProperty({ description: 'Para birimi', example: 'TRY' })
  @Column({ type: 'varchar', length: 10, default: 'TRY' })
  fiyat_birimi: string;

  @ApiProperty({
    description: 'Fiyatlandırma tipi',
    enum: FiyatTipi,
    example: FiyatTipi.GUNLUK,
  })
  @Column({ type: 'enum', enum: FiyatTipi, default: FiyatTipi.GUNLUK })
  fiyat_tipi: FiyatTipi;

  @ApiProperty({
    description: 'Stok durumu',
    enum: StokDurumu,
    example: StokDurumu.MEVCUT,
  })
  @Column({ type: 'enum', enum: StokDurumu, default: StokDurumu.MEVCUT })
  stok_durumu: StokDurumu;

  @ApiProperty({
    description: 'Ürün özellikleri (hizmete göre değişir)',
    example: {
      konum: 'İstanbul',
      kapasite: 2,
      marka: 'BMW',
      model: '320i',
    },
  })
  @Column({ type: 'json', nullable: true })
  ozellikler: Record<string, any>;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)' })
  @Column({ type: 'smallint', default: 1 })
  durum: number;

  @ApiProperty({ description: 'Oluşturma tarihi' })
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  @UpdateDateColumn()
  guncelleme_tarihi: Date;

  // İlişkiler
  @ManyToOne(() => Hizmetler, { eager: true })
  @JoinColumn({ name: 'hizmet_id' })
  hizmet: Hizmetler;
}

