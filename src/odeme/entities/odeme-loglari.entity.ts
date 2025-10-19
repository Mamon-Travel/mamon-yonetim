import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Odemeler } from './odemeler.entity';

@Entity('odeme_loglari')
export class OdemeLoglari {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'odeme_id', nullable: true })
  odemeId: number;

  @Column({ name: 'merchant_oid', nullable: true })
  merchantOid: string;

  @Column({ name: 'log_tipi', default: 'callback' })
  logTipi: string;

  @Column({ name: 'istek_verisi', type: 'jsonb', nullable: true })
  istekVerisi: any;

  @Column({ name: 'yanit_verisi', type: 'jsonb', nullable: true })
  yanitVerisi: any;

  @Column({ name: 'ip_adresi', nullable: true })
  ipAdresi: string;

  @CreateDateColumn({ name: 'olusturma_tarihi' })
  olusturmaTarihi: Date;

  // İlişki
  @ManyToOne(() => Odemeler, { nullable: true })
  @JoinColumn({ name: 'odeme_id' })
  odeme: Odemeler;
}

