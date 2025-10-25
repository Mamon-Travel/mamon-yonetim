import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("otel_ozellik")
export class OtelOzellik {
  @ApiProperty({ description: "Özellik ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Özellik başlığı" })
  @Column({ type: "varchar", length: 100 })
  baslik: string;

  @ApiProperty({ description: "Özellik açıklaması", required: false })
  @Column({ type: "text", nullable: true })
  aciklama?: string;

  @ApiProperty({ description: "İkon adı", required: false })
  @Column({ type: "varchar", length: 100, nullable: true })
  ikon?: string;

  @ApiProperty({ description: "Sıralama" })
  @Column({ type: "int", default: 0 })
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









