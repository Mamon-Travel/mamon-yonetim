import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Kategori } from "./entities/kategori.entity";
import { CreateKategoriDto } from "./dto/create-kategori.dto";
import { UpdateKategoriDto } from "./dto/update-kategori.dto";

@Injectable()
export class KategorilerService {
  constructor(
    @InjectRepository(Kategori)
    private kategorilerRepository: Repository<Kategori>
  ) {}

  async create(createKategoriDto: CreateKategoriDto): Promise<Kategori> {
    const kategori = this.kategorilerRepository.create(createKategoriDto);
    return this.kategorilerRepository.save(kategori);
  }

  async findAll(): Promise<Kategori[]> {
    return this.kategorilerRepository.find({
      relations: ["hizmet"],
      where: { durum: 1 },
      order: { hizmet_id: "ASC", sira: "ASC" },
    });
  }

  async findByHizmetId(hizmetId: number): Promise<Kategori[]> {
    return this.kategorilerRepository.find({
      where: { hizmet_id: hizmetId, durum: 1 },
      order: { sira: "ASC" },
    });
  }

  async findByHizmetSlug(hizmetSlug: string): Promise<Kategori[]> {
    return this.kategorilerRepository
      .createQueryBuilder("kategori")
      .innerJoin("kategori.hizmet", "hizmet")
      .where("hizmet.slug = :hizmetSlug", { hizmetSlug })
      .andWhere("kategori.durum = :durum", { durum: 1 })
      .orderBy("kategori.sira", "ASC")
      .getMany();
  }

  async findBySlug(slug: string, hizmetId?: number): Promise<Kategori> {
    const where: any = { slug, durum: 1 };
    if (hizmetId) {
      where.hizmet_id = hizmetId;
    }

    const kategori = await this.kategorilerRepository.findOne({
      where,
      relations: ["hizmet"],
    });

    if (!kategori) {
      throw new NotFoundException(`Kategori bulunamadı (slug: ${slug})`);
    }

    return kategori;
  }

  async findOne(id: number): Promise<Kategori> {
    const kategori = await this.kategorilerRepository.findOne({
      where: { id },
      relations: ["hizmet"],
    });

    if (!kategori) {
      throw new NotFoundException(`Kategori bulunamadı (ID: ${id})`);
    }

    return kategori;
  }

  async update(
    id: number,
    updateKategoriDto: UpdateKategoriDto
  ): Promise<Kategori> {
    const kategori = await this.findOne(id);
    Object.assign(kategori, updateKategoriDto);
    return this.kategorilerRepository.save(kategori);
  }

  async remove(id: number): Promise<void> {
    const kategori = await this.findOne(id);
    await this.kategorilerRepository.remove(kategori);
  }

  // Soft delete (sadece durumu pasif yap)
  async softRemove(id: number): Promise<Kategori> {
    const kategori = await this.findOne(id);
    kategori.durum = 0;
    return this.kategorilerRepository.save(kategori);
  }
}

