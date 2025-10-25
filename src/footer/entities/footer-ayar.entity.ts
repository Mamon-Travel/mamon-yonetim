import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("footer_ayarlar")
export class FooterAyar {
  @ApiProperty({ description: "Ayar ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Anahtar (about_text, copyright, facebook_url, vb.)" })
  @Column({ type: "varchar", length: 100, unique: true })
  anahtar: string;

  @ApiProperty({ description: "Değer", required: false })
  @Column({ type: "text", nullable: true })
  deger?: string;

  @ApiProperty({ description: "Tip (text, url, email)", required: false })
  @Column({ type: "varchar", length: 50, default: "text" })
  tip?: string;

  @ApiProperty({ description: "Açıklama", required: false })
  @Column({ type: "text", nullable: true })
  aciklama?: string;

  @ApiProperty({ description: "Oluşturma tarihi" })
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty({ description: "Güncellenme tarihi" })
  @UpdateDateColumn()
  guncelleme_tarihi: Date;
}

