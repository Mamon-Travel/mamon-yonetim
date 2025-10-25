import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('otel_pansiyon_tipleri')
export class OtelPansiyonTipi {
  @ApiProperty({ description: 'Pansiyon tipi ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Pansiyon kodu', example: 'AI' })
  @Column({ type: 'varchar', length: 10, unique: true })
  kod: string;

  @ApiProperty({ description: 'Pansiyon adı', example: 'Her Şey Dahil' })
  @Column({ type: 'varchar', length: 100 })
  ad: string;

  @ApiProperty({ description: 'Açıklama' })
  @Column({ type: 'text', nullable: true })
  aciklama: string;

  @ApiProperty({ description: 'Sıra' })
  @Column({ type: 'int', default: 0 })
  sira: number;

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

