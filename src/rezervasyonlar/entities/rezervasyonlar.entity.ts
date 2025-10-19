import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Kullanicilar } from '../../kullanicilar/entities/kullanicilar.entity';
import { RezervasyonDetaylari } from './rezervasyon-detaylari.entity';

export enum RezervasyonDurumu {
  BEKLEMEDE = 'beklemede',
  ONAYLANDI = 'onaylandi',
  IPTAL_EDILDI = 'iptal_edildi',
  TAMAMLANDI = 'tamamlandi',
}

export enum OdemeDurumu {
  BEKLENIYOR = 'bekleniyor',
  ODENDI = 'odendi',
  IADE_EDILDI = 'iade_edildi',
}

@Entity('rezervasyonlar')
export class Rezervasyonlar {
  @ApiProperty({ description: 'Rezervasyon ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Kullanıcı ID' })
  @Column({ type: 'int' })
  kullanici_id: number;

  @ApiProperty({ description: 'Rezervasyon numarası', example: 'RSV-2024-001' })
  @Column({ type: 'varchar', length: 50, unique: true })
  rezervasyon_no: string;

  @ApiProperty({ description: 'Toplam tutar' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  toplam_tutar: number;

  @ApiProperty({ description: 'Para birimi', example: 'TRY' })
  @Column({ type: 'varchar', length: 10, default: 'TRY' })
  para_birimi: string;

  @ApiProperty({
    description: 'Rezervasyon durumu',
    enum: RezervasyonDurumu,
  })
  @Column({
    type: 'enum',
    enum: RezervasyonDurumu,
    default: RezervasyonDurumu.BEKLEMEDE,
  })
  durum: RezervasyonDurumu;

  @ApiProperty({ description: 'Ödeme durumu', enum: OdemeDurumu })
  @Column({
    type: 'enum',
    enum: OdemeDurumu,
    default: OdemeDurumu.BEKLENIYOR,
  })
  odeme_durumu: OdemeDurumu;

  @ApiProperty({ description: 'Ödeme yöntemi', example: 'Kredi Kartı' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  odeme_yontemi: string;

  @ApiProperty({ description: 'Müşteri notu' })
  @Column({ type: 'text', nullable: true })
  not: string;

  @ApiProperty({ description: 'Oluşturma tarihi' })
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  @UpdateDateColumn()
  guncelleme_tarihi: Date;

  // İlişkiler
  @ManyToOne(() => Kullanicilar, { eager: true })
  @JoinColumn({ name: 'kullanici_id' })
  kullanici: Kullanicilar;

  @OneToMany(() => RezervasyonDetaylari, (detay) => detay.rezervasyon, {
    cascade: true,
  })
  detaylar: RezervasyonDetaylari[];
}

