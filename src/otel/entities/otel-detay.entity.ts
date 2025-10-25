import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Otel } from "./otel.entity";

@Entity("otel_detay")
export class OtelDetay {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: "int" })
  otel_id: number;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  kisa_aciklama: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  uzun_aciklama: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  denize_mesafe: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  havalimani_mesafe: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  sehir_merkezi_mesafe: string;

  @ApiProperty()
  @Column({ type: "int", nullable: true })
  oda_sayisi: number;

  @ApiProperty()
  @Column({ type: "int", nullable: true })
  acilis_yili: number;

  @ApiProperty()
  @Column({ type: "int", nullable: true })
  renovasyon_yili: number;

  @ApiProperty()
  @Column({ type: "int", nullable: true })
  kat_sayisi: number;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  onemli_bilgiler: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  covid_onlemleri: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  cocuk_politikasi: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  evcil_hayvan_politikasi: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  iptal_politikasi: string;

  @OneToOne(() => Otel, (otel) => otel.detay)
  @JoinColumn({ name: "otel_id" })
  otel: Otel;
}









