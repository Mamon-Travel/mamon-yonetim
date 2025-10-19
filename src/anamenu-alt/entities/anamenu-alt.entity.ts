import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Anamenu } from "../../anamenu/entities/anamenu.entity";
import { Menu } from "../../menu/entities/menu.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("anamenu_alt")
export class AnamenuAlt {
  @ApiProperty({ description: "Alt menü ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Menü başlığı" })
  @Column({ type: "varchar", length: 255 })
  baslik: string;

  @ApiProperty({ description: "Anamenu ID" })
  @Column({ name: "anamenu_id", type: "integer" })
  anamenu_id: number;

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

  @ApiProperty({ description: "Durum (1: Aktif, 0: Pasif)" })
  @Column({ type: "smallint", default: 1 })
  durum: number;

  @ApiProperty({ description: "Bağlı olduğu anamenu", type: () => Anamenu })
  @ManyToOne(() => Anamenu, (anamenu) => anamenu.anamenuAltlar)
  @JoinColumn({ name: "anamenu_id" })
  anamenu: Anamenu;

  @ApiProperty({ description: "Alt menüler", type: () => [Menu] })
  @OneToMany(() => Menu, (menu) => menu.anamenuAlt)
  menuler: Menu[];
}

