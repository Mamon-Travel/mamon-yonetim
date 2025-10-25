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
import { Rezervasyonlar } from './rezervasyonlar.entity';
import { OtelOdaTipi } from '../../otel/entities/otel-oda-tipi.entity';
import { OtelPansiyonTipi } from '../../otel-pansiyon-tipi/entities/otel-pansiyon-tipi.entity';

export enum RezervasyonDetayDurumu {
  AKTIF = 'aktif',
  IPTAL = 'iptal',
  DEGISTIRILDI = 'degistirildi',
}

@Entity('otel_rezervasyon_detaylari')
export class OtelRezervasyonDetaylari {
  @ApiProperty({ description: 'Detay ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Rezervasyon ID' })
  @Column({ type: 'int' })
  rezervasyon_id: number;

  @ApiProperty({ description: 'Oda tipi ID' })
  @Column({ type: 'int' })
  oda_tipi_id: number;

  @ApiProperty({ description: 'Pansiyon tipi ID' })
  @Column({ type: 'int', nullable: true })
  pansiyon_tipi_id: number;

  @ApiProperty({ description: 'Giriş tarihi', example: '2024-12-20' })
  @Column({ type: 'date' })
  giris_tarihi: Date;

  @ApiProperty({ description: 'Çıkış tarihi', example: '2024-12-25' })
  @Column({ type: 'date' })
  cikis_tarihi: Date;

  @ApiProperty({ description: 'Gece sayısı', example: 5 })
  @Column({ type: 'int' })
  gece_sayisi: number;

  @ApiProperty({ description: 'Oda sayısı', example: 2 })
  @Column({ type: 'int', default: 1 })
  oda_sayisi: number;

  @ApiProperty({ description: 'Yetişkin sayısı', example: 2 })
  @Column({ type: 'int', default: 2 })
  yetiskin_sayisi: number;

  @ApiProperty({ description: 'Çocuk sayısı', example: 1 })
  @Column({ type: 'int', default: 0 })
  cocuk_sayisi: number;

  @ApiProperty({ description: 'Bebek sayısı', example: 0 })
  @Column({ type: 'int', default: 0 })
  bebek_sayisi: number;

  @ApiProperty({ description: 'Gecelik birim fiyat', example: 1500.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  birim_fiyat: number;

  @ApiProperty({ description: 'Toplam fiyat', example: 7500.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  toplam_fiyat: number;

  @ApiProperty({ description: 'Özel istekler' })
  @Column({ type: 'text', nullable: true })
  ozel_istekler: string;

  @ApiProperty({
    description: 'Durum',
    enum: RezervasyonDetayDurumu,
    default: RezervasyonDetayDurumu.AKTIF,
  })
  @Column({
    type: 'enum',
    enum: RezervasyonDetayDurumu,
    default: RezervasyonDetayDurumu.AKTIF,
  })
  durum: RezervasyonDetayDurumu;

  @ApiProperty({ description: 'Oluşturma tarihi' })
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  @UpdateDateColumn()
  guncelleme_tarihi: Date;

  // İlişkiler
  @ManyToOne(() => Rezervasyonlar)
  @JoinColumn({ name: 'rezervasyon_id' })
  rezervasyon: Rezervasyonlar;

  @ManyToOne(() => OtelOdaTipi, { eager: true })
  @JoinColumn({ name: 'oda_tipi_id' })
  odaTipi: OtelOdaTipi;

  @ManyToOne(() => OtelPansiyonTipi, { eager: true })
  @JoinColumn({ name: 'pansiyon_tipi_id' })
  pansiyonTipi: OtelPansiyonTipi;
}

