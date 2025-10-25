import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("footer_menuler")
export class FooterMenu {
  @ApiProperty({ description: "Menü ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Kategori (solutions, support, company, legal)" })
  @Column({ type: "varchar", length: 100 })
  kategori: string;

  @ApiProperty({ description: "Menü başlığı" })
  @Column({ type: "varchar", length: 255 })
  baslik: string;

  @ApiProperty({ description: "URL" })
  @Column({ type: "varchar", length: 500 })
  url: string;

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

