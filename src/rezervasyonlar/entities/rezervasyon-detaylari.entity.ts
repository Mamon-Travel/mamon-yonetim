import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Rezervasyonlar } from './rezervasyonlar.entity';
import { Urunler } from '../../urunler/entities/urunler.entity';

@Entity('rezervasyon_detaylari')
export class RezervasyonDetaylari {
  @ApiProperty({ description: 'Detay ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Rezervasyon ID' })
  @Column({ type: 'int' })
  rezervasyon_id: number;

  @ApiProperty({ description: 'Ürün ID' })
  @Column({ type: 'int' })
  urun_id: number;

  @ApiProperty({ description: 'Hizmet adı (referans)' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  hizmet_adi: string;

  @ApiProperty({ description: 'Ürün adı (referans)' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  urun_adi: string;

  @ApiProperty({ description: 'Miktar' })
  @Column({ type: 'int', default: 1 })
  miktar: number;

  @ApiProperty({ description: 'Birim fiyat' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  birim_fiyat: number;

  @ApiProperty({ description: 'Toplam fiyat' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  toplam_fiyat: number;

  @ApiProperty({
    description: 'Rezervasyon bilgileri (tarih, konum vb.)',
    example: {
      giris_tarihi: '2024-12-20',
      cikis_tarihi: '2024-12-25',
      misafir_sayisi: 2,
    },
  })
  @Column({ type: 'json', nullable: true })
  rezervasyon_bilgileri: Record<string, any>;

  @ApiProperty({ description: 'Oluşturma tarihi' })
  @CreateDateColumn()
  olusturma_tarihi: Date;

  // İlişkiler
  @ManyToOne(() => Rezervasyonlar, (rezervasyon) => rezervasyon.detaylar)
  @JoinColumn({ name: 'rezervasyon_id' })
  rezervasyon: Rezervasyonlar;

  @ManyToOne(() => Urunler, { eager: true })
  @JoinColumn({ name: 'urun_id' })
  urun: Urunler;
}


