import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { AnamenuAlt } from "../../anamenu-alt/entities/anamenu-alt.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("menu")
export class Menu {
  @ApiProperty({ description: "Menu ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Alt menü adı" })
  @Column({ type: "varchar", length: 255 })
  menu: string;

  @ApiProperty({ description: "Anamenu Alt ID" })
  @Column({ name: "anamenu_alt_id", type: "integer" })
  anamenu_alt_id: number;

  @ApiProperty({ description: "Rota bilgisi" })
  @Column({ type: "varchar", length: 255 })
  rota: string;

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

  @ApiProperty({
    description: "Bağlı olduğu anamenu alt",
    type: () => AnamenuAlt,
  })
  @ManyToOne(() => AnamenuAlt, (anamenuAlt) => anamenuAlt.menuler)
  @JoinColumn({ name: "anamenu_alt_id" })
  anamenuAlt: AnamenuAlt;
}
