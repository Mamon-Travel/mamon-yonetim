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
import { Otel } from "./otel.entity";

@Entity("otel_oda_tipi")
export class OtelOdaTipi {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: "int" })
  otel_id: number;

  @ApiProperty()
  @Column({ type: "varchar", length: 255 })
  ad: string;

  @ApiProperty()
  @Column({ type: "int", default: 2 })
  kapasite: number;

  @ApiProperty()
  @Column({ type: "int", default: 2 })
  yetiskin_kapasite: number;

  @ApiProperty()
  @Column({ type: "int", default: 0 })
  cocuk_kapasite: number;

  @ApiProperty()
  @Column({ type: "int", default: 1 })
  oda_sayisi: number;

  @ApiProperty()
  @Column({ type: "int", nullable: true })
  metrekare: number;

  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  yatak_tipi: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 100, nullable: true })
  manzara: string;

  @ApiProperty()
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  fiyat: number;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  aciklama: string;

  @ApiProperty()
  @Column({ type: "smallint", default: 1 })
  durum: number;

  @ApiProperty()
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ApiProperty()
  @UpdateDateColumn()
  guncelleme_tarihi: Date;

  @ManyToOne(() => Otel, (otel) => otel.odaTipleri)
  @JoinColumn({ name: "otel_id" })
  otel: Otel;
}

