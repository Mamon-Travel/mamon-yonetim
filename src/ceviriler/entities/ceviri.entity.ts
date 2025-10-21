import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { Dil } from "../../diller/entities/dil.entity";

@Entity("ceviriler")
@Unique(["dil_id", "anahtar"])
export class Ceviri {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dil_id: number;

  @Column({ length: 255 })
  anahtar: string;

  @Column("text")
  deger: string;

  @Column({ length: 100, nullable: true })
  kategori: string;

  @Column("text", { nullable: true })
  aciklama: string;

  @Column({ default: 1 })
  durum: number;

  @CreateDateColumn()
  olusturma_tarihi: Date;

  @UpdateDateColumn()
  guncelleme_tarihi: Date;

  @ManyToOne(() => Dil, (dil) => dil.ceviriler)
  @JoinColumn({ name: "dil_id" })
  dil: Dil;
}


