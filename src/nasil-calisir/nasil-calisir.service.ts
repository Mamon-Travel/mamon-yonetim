import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NasilCalisir } from "./entities/nasil-calisir.entity";
import { CreateNasilCalisirDto } from "./dto/create-nasil-calisir.dto";
import { UpdateNasilCalisirDto } from "./dto/update-nasil-calisir.dto";

@Injectable()
export class NasilCalisirService {
  constructor(
    @InjectRepository(NasilCalisir)
    private nasilCalisirRepository: Repository<NasilCalisir>
  ) {}

  async create(createDto: CreateNasilCalisirDto): Promise<NasilCalisir> {
    const adim = this.nasilCalisirRepository.create(createDto);
    return this.nasilCalisirRepository.save(adim);
  }

  async findAll(): Promise<NasilCalisir[]> {
    return this.nasilCalisirRepository.find({
      where: { durum: 1 },
      order: { sayfa: "ASC", sira: "ASC" },
    });
  }

  async findBySayfa(sayfa: string): Promise<NasilCalisir[]> {
    return this.nasilCalisirRepository.find({
      where: { sayfa, durum: 1 },
      order: { sira: "ASC" },
    });
  }

  async findOne(id: number): Promise<NasilCalisir> {
    const adim = await this.nasilCalisirRepository.findOne({
      where: { id },
    });

    if (!adim) {
      throw new NotFoundException(`Nasıl çalışır adımı bulunamadı (ID: ${id})`);
    }

    return adim;
  }

  async update(id: number, updateDto: UpdateNasilCalisirDto): Promise<NasilCalisir> {
    const adim = await this.findOne(id);
    Object.assign(adim, updateDto);
    return this.nasilCalisirRepository.save(adim);
  }

  async remove(id: number): Promise<void> {
    const adim = await this.findOne(id);
    await this.nasilCalisirRepository.remove(adim);
  }
}

