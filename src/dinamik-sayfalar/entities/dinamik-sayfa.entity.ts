import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface FiltrKriterleri {
  bolgeler?: string[];
  kategoriler?: number[];
  ozellikler?: number[];
  yildiz?: number[];
  konseptler?: string[];
  min_fiyat?: number;
  max_fiyat?: number;
}

@Entity('dinamik_sayfalar')
export class DinamikSayfa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  baslik: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  aciklama: string;

  @Column({ type: 'jsonb', default: {} })
  filtre_kriterleri: FiltrKriterleri;

  @Column({ length: 255, nullable: true })
  meta_title: string;

  @Column({ type: 'text', nullable: true })
  meta_description: string;

  @Column({ type: 'text', nullable: true })
  meta_keywords: string;

  @Column({ length: 500, nullable: true })
  kapak_gorseli: string;

  @Column({ default: 0 })
  sira: number;

  @Column({ default: 1 })
  durum: number;

  @Column({ type: 'text', nullable: true })
  ust_icerik: string;

  @Column({ type: 'text', nullable: true })
  alt_icerik: string;

  @CreateDateColumn()
  olusturma_tarihi: Date;

  @UpdateDateColumn()
  guncelleme_tarihi: Date;

  @Column({ nullable: true })
  olusturan_kullanici_id: number;
}

