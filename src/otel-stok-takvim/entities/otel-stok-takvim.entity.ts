import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OtelOdaTipi } from '../../otel/entities/otel-oda-tipi.entity';

@Entity('otel_oda_stok_takvimi')
@Unique(['oda_tipi_id', 'tarih'])
export class OtelStokTakvim {
  @ApiProperty({ description: 'Stok takvim ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Oda tipi ID' })
  @Column({ type: 'int' })
  oda_tipi_id: number;

  @ApiProperty({ description: 'Tarih', example: '2024-12-25' })
  @Column({ type: 'date' })
  tarih: Date;

  @ApiProperty({ description: 'Toplam oda sayısı', example: 10 })
  @Column({ type: 'int' })
  toplam_oda: number;

  @ApiProperty({ description: 'Rezerve edilen oda sayısı', example: 7 })
  @Column({ type: 'int', default: 0 })
  rezerve_oda: number;

  @ApiProperty({ description: 'Bloke/Bakımda olan oda sayısı', example: 1 })
  @Column({ type: 'int', default: 0 })
  bloke_oda: number;

  @ApiProperty({
    description: 'Müsait oda sayısı (otomatik hesaplanır)',
    example: 2,
  })
  musait_oda: number; // Bu generated column, TypeORM'de okumak için tanımlıyoruz

  @ApiProperty({ description: 'Notlar' })
  @Column({ type: 'text', nullable: true })
  notlar: string;

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
}

