import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { AnamenuAlt } from "../../anamenu-alt/entities/anamenu-alt.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("anamenu")
export class Anamenu {
  @ApiProperty({ description: "Anamenu ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Kategori/Başlık adı" })
  @Column({ type: "varchar", length: 255 })
  anamenu: string;

  @ApiProperty({ description: "İkon adı", required: false })
  @Column({ type: "varchar", length: 100, nullable: true })
  ikon?: string;

  @ApiProperty({ description: "Sıra numarası", required: false })
  @Column({ type: "integer", default: 0 })
  sira: number;

  @ApiProperty({
    description: "Yetki ID'leri (virgülle ayrılmış)",
    required: false,
  })
  @Column({ type: "varchar", length: 255, nullable: true })
  yetki_ids?: string;

  @ApiProperty({ description: "Ana menü öğeleri", type: () => [AnamenuAlt] })
  @OneToMany(() => AnamenuAlt, (anamenuAlt) => anamenuAlt.anamenu)
  anamenuAltlar: AnamenuAlt[];
}
