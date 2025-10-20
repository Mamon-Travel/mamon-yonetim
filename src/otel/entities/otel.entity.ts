import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { OtelDetay } from "./otel-detay.entity";
import { OtelGorsel } from "./otel-gorsel.entity";
import { OtelOdaTipi } from "./otel-oda-tipi.entity";

@Entity("otel")
export class Otel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: "int", default: 1 })
  hizmet_id: number;

  @ApiProperty()
  @Column({ type: "varchar", length: 255 })
  ad: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  slug: string;

  @ApiProperty()
  @Column({ type: "smallint", default: 5 })
  yildiz: number;

  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  konsept: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  sehir: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  bolge: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  adres: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 50, nullable: true })
  telefon: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  email: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 255, nullable: true })
  web_site: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 20, default: "14:00" })
  check_in_time: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 20, default: "12:00" })
  check_out_time: string;

  @ApiProperty()
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  min_fiyat: number;

  @ApiProperty()
  @Column({ type: "varchar", length: 500, nullable: true })
  kapak_gorseli: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 500, nullable: true })
  video_url: string;

  @ApiProperty()
  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  enlem: number;

  @ApiProperty()
  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  boylam: number;

  @ApiProperty()
  @Column({ type: "smallint", default: 1 })
  durum: number;

  @ApiProperty()
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty()
  @UpdateDateColumn()
  guncelleme_tarihi: Date;

  @OneToOne(() => OtelDetay, (detay) => detay.otel, { eager: true })
  detay: OtelDetay;

  @OneToMany(() => OtelGorsel, (gorsel) => gorsel.otel)
  gorseller: OtelGorsel[];

  @OneToMany(() => OtelOdaTipi, (odaTipi) => odaTipi.otel)
  odaTipleri: OtelOdaTipi[];
}

