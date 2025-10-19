import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Kullanicilar } from '../../kullanicilar/entities/kullanicilar.entity';
import { Urunler } from '../../urunler/entities/urunler.entity';

@Entity('sepet')
export class Sepet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'kullanici_id' })
  kullaniciId: number;

  @Column({ name: 'urun_id' })
  urunId: number;

  @Column({ default: 1 })
  miktar: number;

  @Column({ name: 'birim_fiyat', type: 'decimal', precision: 10, scale: 2 })
  birimFiyat: number;

  @Column({ name: 'toplam_fiyat', type: 'decimal', precision: 10, scale: 2 })
  toplamFiyat: number;

  @Column({ name: 'rezervasyon_bilgileri', type: 'jsonb', nullable: true })
  rezervasyonBilgileri: any;

  @CreateDateColumn({ name: 'olusturma_tarihi' })
  olusturmaTarihi: Date;

  @UpdateDateColumn({ name: 'guncelleme_tarihi' })
  guncellemeTarihi: Date;

  // İlişkiler
  @ManyToOne(() => Kullanicilar)
  @JoinColumn({ name: 'kullanici_id' })
  kullanici: Kullanicilar;

  @ManyToOne(() => Urunler)
  @JoinColumn({ name: 'urun_id' })
  urun: Urunler;
}

