import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Ceviri } from "../../ceviriler/entities/ceviri.entity";

@Entity("diller")
export class Dil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, unique: true })
  kod: string;

  @Column({ length: 100 })
  ad: string;

  @Column({ length: 100, nullable: true })
  yerel_ad: string;

  @Column({ default: false })
  varsayilan: boolean;

  @Column({ default: 1 })
  durum: number;

  @CreateDateColumn()
  olusturma_tarihi: Date;

  @UpdateDateColumn()
  guncelleme_tarihi: Date;

  @OneToMany(() => Ceviri, (ceviri) => ceviri.dil)
  ceviriler: Ceviri[];
}









