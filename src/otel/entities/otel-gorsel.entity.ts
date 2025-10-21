import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Otel } from "./otel.entity";

@Entity("otel_gorsel")
export class OtelGorsel {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: "int" })
  otel_id: number;

  @ApiProperty()
  @Column({ type: "varchar", length: 500 })
  gorsel_url: string;

  @ApiProperty()
  @Column({ type: "varchar", length: 255, nullable: true })
  baslik: string;

  @ApiProperty()
  @Column({ type: "int", default: 0 })
  sira: number;

  @ApiProperty()
  @Column({ type: "varchar", length: 50, default: "genel" })
  gorsel_tipi: string;

  @ApiProperty()
  @CreateDateColumn()
  olusturma_tarihi: Date;

  @ManyToOne(() => Otel, (otel) => otel.gorseller)
  @JoinColumn({ name: "otel_id" })
  otel: Otel;
}


