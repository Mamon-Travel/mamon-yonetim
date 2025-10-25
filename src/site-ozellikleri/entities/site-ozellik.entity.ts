import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("site_ozellikleri")
export class SiteOzellik {
  @ApiProperty({ description: "Özellik ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Sayfa (anasayfa, hakkimizda, vb.)" })
  @Column({ type: "varchar", length: 100, default: "anasayfa" })
  sayfa: string;

  @ApiProperty({ description: "Rozet metni (Advertising, Exposure, vb.)" })
  @Column({ type: "varchar", length: 100 })
  rozet: string;

  @ApiProperty({ description: "Rozet rengi (red, green, blue)" })
  @Column({ type: "varchar", length: 20, default: "blue" })
  rozet_renk: string;

  @ApiProperty({ description: "Özellik başlığı" })
  @Column({ type: "varchar", length: 255 })
  baslik: string;

  @ApiProperty({ description: "Özellik açıklaması", required: false })
  @Column({ type: "text", nullable: true })
  aciklama?: string;

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

