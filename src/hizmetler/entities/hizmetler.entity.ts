import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("hizmetler")
export class Hizmetler {
  @ApiProperty({ description: "Hizmet ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Hizmet adı (örn: Konaklama, Araç Kiralama)" })
  @Column({ type: "varchar", length: 255 })
  ad: string;

  @ApiProperty({ description: "Hizmet slug (örn: stays, cars, real-estate)" })
  @Column({ type: "varchar", length: 100, unique: true })
  slug: string;

  @ApiProperty({ description: "Hizmet açıklaması", required: false })
  @Column({ type: "text", nullable: true })
  aciklama?: string;

  @ApiProperty({ description: "Hizmet ikonu", required: false })
  @Column({ type: "varchar", length: 100, nullable: true })
  ikon?: string;

  @ApiProperty({ description: "Hizmet rengi (hex kodu)", required: false })
  @Column({ type: "varchar", length: 7, nullable: true })
  renk?: string;

  @ApiProperty({ description: "Sıra numarası" })
  @Column({ type: "integer", default: 0 })
  sira: number;

  @ApiProperty({ description: "Aktif durumu" })
  @Column({ type: "boolean", default: true })
  aktif: boolean;

  @ApiProperty({ description: "Ana sayfa URL'i" })
  @Column({ type: "varchar", length: 255 })
  url: string;

  @ApiProperty({ description: "Meta başlık", required: false })
  @Column({ type: "varchar", length: 255, nullable: true })
  meta_title?: string;

  @ApiProperty({ description: "Meta açıklama", required: false })
  @Column({ type: "text", nullable: true })
  meta_description?: string;

  @ApiProperty({ description: "Oluşturulma tarihi" })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: "Güncellenme tarihi" })
  @UpdateDateColumn()
  updated_at: Date;
}
