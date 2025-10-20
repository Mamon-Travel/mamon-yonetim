import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ceviri } from "./entities/ceviri.entity";
import { CreateCeviriDto } from "./dto/create-ceviri.dto";
import { UpdateCeviriDto } from "./dto/update-ceviri.dto";

@Injectable()
export class CevirilerService {
  constructor(
    @InjectRepository(Ceviri)
    private cevirilerRepository: Repository<Ceviri>
  ) {}

  async create(createCeviriDto: CreateCeviriDto): Promise<Ceviri> {
    // Aynı dil ve anahtar ile çeviri var mı kontrol et
    const existingCeviri = await this.cevirilerRepository.findOne({
      where: {
        dil_id: createCeviriDto.dil_id,
        anahtar: createCeviriDto.anahtar,
      },
    });

    if (existingCeviri) {
      throw new ConflictException("Bu anahtar için bu dilde zaten çeviri mevcut");
    }

    const ceviri = this.cevirilerRepository.create(createCeviriDto);
    return this.cevirilerRepository.save(ceviri);
  }

  async createBulk(ceviriler: CreateCeviriDto[]): Promise<Ceviri[]> {
    const createdCeviriler: Ceviri[] = [];

    for (const ceviriDto of ceviriler) {
      try {
        const ceviri = await this.create(ceviriDto);
        createdCeviriler.push(ceviri);
      } catch (error) {
        // Zaten varsa güncelle
        if (error instanceof ConflictException) {
          const existing = await this.cevirilerRepository.findOne({
            where: {
              dil_id: ceviriDto.dil_id,
              anahtar: ceviriDto.anahtar,
            },
          });
          if (existing) {
            Object.assign(existing, ceviriDto);
            const updated = await this.cevirilerRepository.save(existing);
            createdCeviriler.push(updated);
          }
        }
      }
    }

    return createdCeviriler;
  }

  async findAll(): Promise<Ceviri[]> {
    return this.cevirilerRepository.find({
      relations: ["dil"],
      order: { kategori: "ASC", anahtar: "ASC" },
    });
  }

  async findByDilId(dilId: number): Promise<Ceviri[]> {
    return this.cevirilerRepository.find({
      where: { dil_id: dilId },
      order: { kategori: "ASC", anahtar: "ASC" },
    });
  }

  async findByDilKod(dilKod: string): Promise<Ceviri[]> {
    return this.cevirilerRepository
      .createQueryBuilder("ceviri")
      .innerJoin("ceviri.dil", "dil")
      .where("dil.kod = :dilKod", { dilKod })
      .andWhere("ceviri.durum = :durum", { durum: 1 })
      .orderBy("ceviri.kategori", "ASC")
      .addOrderBy("ceviri.anahtar", "ASC")
      .getMany();
  }

  async findByKategori(kategori: string): Promise<Ceviri[]> {
    return this.cevirilerRepository.find({
      where: { kategori },
      relations: ["dil"],
      order: { anahtar: "ASC" },
    });
  }

  async findByDilAndKategori(dilId: number, kategori: string): Promise<Ceviri[]> {
    return this.cevirilerRepository.find({
      where: { dil_id: dilId, kategori },
      order: { anahtar: "ASC" },
    });
  }

  // Dile göre çevirileri anahtar-değer objesi olarak döndür
  async getTranslationsObject(dilKod: string): Promise<Record<string, string>> {
    const ceviriler = await this.findByDilKod(dilKod);
    const translationsObj: Record<string, string> = {};

    ceviriler.forEach((ceviri) => {
      translationsObj[ceviri.anahtar] = ceviri.deger;
    });

    return translationsObj;
  }

  async findOne(id: number): Promise<Ceviri> {
    const ceviri = await this.cevirilerRepository.findOne({
      where: { id },
      relations: ["dil"],
    });

    if (!ceviri) {
      throw new NotFoundException(`Çeviri bulunamadı (ID: ${id})`);
    }

    return ceviri;
  }

  async update(id: number, updateCeviriDto: UpdateCeviriDto): Promise<Ceviri> {
    const ceviri = await this.findOne(id);

    // Dil veya anahtar değiştiriliyorsa, çakışma kontrolü yap
    if (
      (updateCeviriDto.dil_id && updateCeviriDto.dil_id !== ceviri.dil_id) ||
      (updateCeviriDto.anahtar && updateCeviriDto.anahtar !== ceviri.anahtar)
    ) {
      const existingCeviri = await this.cevirilerRepository.findOne({
        where: {
          dil_id: updateCeviriDto.dil_id || ceviri.dil_id,
          anahtar: updateCeviriDto.anahtar || ceviri.anahtar,
        },
      });

      if (existingCeviri && existingCeviri.id !== id) {
        throw new ConflictException("Bu anahtar için bu dilde zaten çeviri mevcut");
      }
    }

    Object.assign(ceviri, updateCeviriDto);
    return this.cevirilerRepository.save(ceviri);
  }

  async remove(id: number): Promise<void> {
    const ceviri = await this.findOne(id);
    await this.cevirilerRepository.remove(ceviri);
  }

  // Belirli bir dil için tüm kategorileri getir
  async getKategorilerByDilId(dilId: number): Promise<string[]> {
    const result = await this.cevirilerRepository
      .createQueryBuilder("ceviri")
      .select("DISTINCT ceviri.kategori", "kategori")
      .where("ceviri.dil_id = :dilId", { dilId })
      .andWhere("ceviri.kategori IS NOT NULL")
      .orderBy("ceviri.kategori", "ASC")
      .getRawMany();

    return result.map((r) => r.kategori);
  }
}

