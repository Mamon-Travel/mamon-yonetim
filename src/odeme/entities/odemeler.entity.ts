import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Kullanicilar } from '../../kullanicilar/entities/kullanicilar.entity';
import { Rezervasyonlar } from '../../rezervasyonlar/entities/rezervasyonlar.entity';

@Entity('odemeler')
export class Odemeler {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rezervasyon_id', nullable: true })
  rezervasyonId: number;

  @Column({ name: 'kullanici_id' })
  kullaniciId: number;

  @Column({ name: 'merchant_oid', unique: true })
  merchantOid: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tutar: number;

  @Column({ name: 'para_birimi', default: 'TRY' })
  paraBirimi: string;

  @Column({ default: 'beklemede' })
  durum: string;

  @Column({ name: 'odeme_yontemi', default: 'paytr' })
  odemeYontemi: string;

  @Column({ name: 'paytr_token', type: 'text', nullable: true })
  paytrToken: string;

  @Column({ name: 'paytr_payment_url', type: 'text', nullable: true })
  paytrPaymentUrl: string;

  @Column({ name: 'hash_value', type: 'text', nullable: true })
  hashValue: string;

  @Column({ name: 'islem_no', nullable: true })
  islemNo: string;

  @Column({ name: 'banka_adi', nullable: true })
  bankaAdi: string;

  @Column({ name: 'taksit_sayisi', default: 1 })
  taksitSayisi: number;

  @Column({ name: 'hata_mesaji', type: 'text', nullable: true })
  hataMesaji: string;

  @Column({ name: 'callback_data', type: 'jsonb', nullable: true })
  callbackData: any;

  @Column({ name: 'ip_adresi', nullable: true })
  ipAdresi: string;

  @CreateDateColumn({ name: 'olusturma_tarihi' })
  olusturmaTarihi: Date;

  @Column({ name: 'odeme_tarihi', type: 'timestamp', nullable: true })
  odemeTarihi: Date;

  // İlişkiler
  @ManyToOne(() => Kullanicilar)
  @JoinColumn({ name: 'kullanici_id' })
  kullanici: Kullanicilar;

  @ManyToOne(() => Rezervasyonlar, { nullable: true })
  @JoinColumn({ name: 'rezervasyon_id' })
  rezervasyon: Rezervasyonlar;
}

