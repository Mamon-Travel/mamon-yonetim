import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Hizmetler } from "../../hizmetler/entities/hizmetler.entity";

@Entity("kategoriler")
export class Kategori {
  @ApiProperty({ description: "Kategori ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Hizmet ID (1=Konaklama, 2=Araç, vb.)" })
  @Column()
  hizmet_id: number;

  @ApiProperty({ description: "Kategori adı (örn: New York, USA)" })
  @Column({ type: "varchar", length: 255 })
  ad: string;

  @ApiProperty({ description: "URL slug (örn: new-york-usa)" })
  @Column({ type: "varchar", length: 255 })
  slug: string;

  @ApiProperty({ description: "Bölge/Region", required: false })
  @Column({ type: "varchar", length: 255, nullable: true })
  bolge?: string;

  @ApiProperty({ description: "Bu kategorideki ilan sayısı" })
  @Column({ type: "integer", default: 0 })
  adet: number;

  @ApiProperty({ description: "Açıklama", required: false })
  @Column({ type: "text", nullable: true })
  aciklama?: string;

  @ApiProperty({ description: "Thumbnail görsel URL", required: false })
  @Column({ type: "varchar", length: 500, nullable: true })
  thumbnail?: string;

  @ApiProperty({ description: "Kapak görseli URL", required: false })
  @Column({ type: "varchar", length: 500, nullable: true })
  kapak_gorseli?: string;

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

  @ApiProperty({ description: "İlişkili hizmet", type: () => Hizmetler })
  @ManyToOne(() => Hizmetler)
  @JoinColumn({ name: "hizmet_id" })
  hizmet?: Hizmetler;
}

