import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("nasil_calisir")
export class NasilCalisir {
  @ApiProperty({ description: "Adım ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Sayfa (anasayfa, hakkimizda, vb.)" })
  @Column({ type: "varchar", length: 100, default: "anasayfa" })
  sayfa: string;

  @ApiProperty({ description: "Adım başlığı" })
  @Column({ type: "varchar", length: 255 })
  baslik: string;

  @ApiProperty({ description: "Adım açıklaması", required: false })
  @Column({ type: "text", nullable: true })
  aciklama?: string;

  @ApiProperty({ description: "Görsel URL (light mode)", required: false })
  @Column({ type: "varchar", length: 500, nullable: true })
  gorsel_url?: string;

  @ApiProperty({ description: "Görsel URL (dark mode)", required: false })
  @Column({ type: "varchar", length: 500, nullable: true })
  gorsel_url_dark?: string;

  @ApiProperty({ description: "Sıra numarası" })
  @Column({ type: "integer", default: 0 })
  sira: number;

  @ApiProperty({ description: "Durum (1: Aktif, 0: Pasif)" })
  @Column({ type: "smallint", default: 1 })
  durum: number;

  @ApiProperty({ description: "Oluşturma tarihi" })
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty({ description: "Güncellenme tarihi" })
  @UpdateDateColumn()
  guncelleme_tarihi: Date;
}

