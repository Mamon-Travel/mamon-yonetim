import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('doviz_kurlar')
@Unique(['para_birimi', 'kur_tarihi'])
export class DovizKur {
  @ApiProperty({ description: 'Kur ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Para birimi kodu', example: 'USD' })
  @Column({ type: 'varchar', length: 10 })
  para_birimi: string;

  @ApiProperty({ description: 'Para adı', example: 'Amerikan Doları' })
  @Column({ type: 'varchar', length: 100 })
  para_adi: string;

  @ApiProperty({ description: 'Marjlı alış kuru', example: 35.06 })
  @Column({ type: 'decimal', precision: 10, scale: 4 })
  alis_kuru: number;

  @ApiProperty({ description: 'Marjlı satış kuru', example: 35.20 })
  @Column({ type: 'decimal', precision: 10, scale: 4 })
  satis_kuru: number;

  @ApiProperty({ description: 'TCMB orijinal alış kuru', example: 34.20 })
  @Column({ type: 'decimal', precision: 10, scale: 4 })
  tcmb_alis: number;

  @ApiProperty({ description: 'TCMB orijinal satış kuru', example: 34.35 })
  @Column({ type: 'decimal', precision: 10, scale: 4 })
  tcmb_satis: number;

  @ApiProperty({ description: 'Marj yüzdesi', example: 2.5 })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  yuzde_marj: number;

  @ApiProperty({ description: 'Kur tarihi', example: '2024-10-24' })
  @Column({ type: 'date' })
  kur_tarihi: Date;

  @ApiProperty({ description: 'Son güncelleme zamanı' })
  @CreateDateColumn({ name: 'son_guncelleme' })
  son_guncelleme: Date;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)' })
  @Column({ type: 'smallint', default: 1 })
  durum: number;
}

