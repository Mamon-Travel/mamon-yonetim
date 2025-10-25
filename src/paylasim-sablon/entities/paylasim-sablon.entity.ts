import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('paylasim_sablonlari')
export class PaylasimSablon {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200 })
  sablon_adi: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  aciklama: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, default: '#FFFFFF' })
  arka_plan_rengi: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: true })
  arka_plan_gorsel: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: 'ust-sol' })
  logo_konum: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, default: 'Arial' })
  baslik_font_family: string;

  @ApiProperty()
  @Column({ type: 'int', default: 48 })
  baslik_font_size: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: '#000000' })
  baslik_renk: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, default: 'Arial' })
  aciklama_font_family: string;

  @ApiProperty()
  @Column({ type: 'int', default: 24 })
  aciklama_font_size: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: '#666666' })
  aciklama_renk: string;

  @ApiProperty()
  @Column({ type: 'int', default: 1200 })
  genislik: number;

  @ApiProperty()
  @Column({ type: 'int', default: 630 })
  yukseklik: number;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  sablon_json: any;

  @ApiProperty()
  @Column({ type: 'smallint', default: 1 })
  durum: number;

  @ApiProperty()
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty()
  @UpdateDateColumn()
  guncelleme_tarihi: Date;
}

