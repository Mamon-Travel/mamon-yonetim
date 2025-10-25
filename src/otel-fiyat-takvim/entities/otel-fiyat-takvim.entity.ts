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
import { OtelOdaTipi } from '../../otel/entities/otel-oda-tipi.entity';
import { OtelPansiyonTipi } from '../../otel-pansiyon-tipi/entities/otel-pansiyon-tipi.entity';

@Entity('otel_oda_fiyat_takvimi')
export class OtelFiyatTakvim {
  @ApiProperty({ description: 'Fiyat takvim ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Oda tipi ID' })
  @Column({ type: 'int' })
  oda_tipi_id: number;

  @ApiProperty({ description: 'Pansiyon tipi ID' })
  @Column({ type: 'int', nullable: true })
  pansiyon_tipi_id: number;

  @ApiProperty({ description: 'Başlangıç tarihi', example: '2024-12-01' })
  @Column({ type: 'date' })
  baslangic_tarihi: Date;

  @ApiProperty({ description: 'Bitiş tarihi', example: '2024-12-31' })
  @Column({ type: 'date' })
  bitis_tarihi: Date;

  @ApiProperty({ description: 'Gecelik fiyat', example: 1500.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fiyat: number;

  @ApiProperty({ description: 'Minimum konaklama gece sayısı', example: 3 })
  @Column({ type: 'int', default: 1 })
  min_konaklama_gece: number;

  @ApiProperty({ description: 'Maksimum konaklama gece sayısı' })
  @Column({ type: 'int', nullable: true })
  max_konaklama_gece: number;

  @ApiProperty({ description: 'Özel dönem adı', example: 'Yılbaşı Kampanyası' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  ozel_donem_adi: string;

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
  @ManyToOne(() => OtelOdaTipi)
  @JoinColumn({ name: 'oda_tipi_id' })
  odaTipi: OtelOdaTipi;

  @ManyToOne(() => OtelPansiyonTipi)
  @JoinColumn({ name: 'pansiyon_tipi_id' })
  pansiyonTipi: OtelPansiyonTipi;
}

