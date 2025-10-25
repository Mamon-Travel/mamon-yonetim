import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Otel } from '../../otel/entities/otel.entity';

@Entity('otel_iptal_politikalari')
export class OtelIptalPolitika {
  @ApiProperty({ description: 'İptal politikası ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Otel ID' })
  @Column({ type: 'int' })
  otel_id: number;

  @ApiProperty({ description: 'Politika adı', example: 'Ücretsiz İptal' })
  @Column({ type: 'varchar', length: 200 })
  ad: string;

  @ApiProperty({
    description: 'Kaç gün öncesine kadar geçerli',
    example: 7,
  })
  @Column({ type: 'int' })
  gun_oncesi: number;

  @ApiProperty({
    description: 'Geri ödeme yüzdesi (100=tam iade, 0=iade yok)',
    example: 100,
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  iade_orani: number;

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

  // İlişkiler
  @ManyToOne(() => Otel)
  @JoinColumn({ name: 'otel_id' })
  otel: Otel;
}

