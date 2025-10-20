import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { Dil } from "./entities/dil.entity";
import { CreateDilDto } from "./dto/create-dil.dto";
import { UpdateDilDto } from "./dto/update-dil.dto";

@Injectable()
export class DillerService {
  constructor(
    @InjectRepository(Dil)
    private dillerRepository: Repository<Dil>
  ) {}

  async create(createDilDto: CreateDilDto): Promise<Dil> {
    // Aynı kodla dil var mı kontrol et
    const existingDil = await this.dillerRepository.findOne({
      where: { kod: createDilDto.kod },
    });

    if (existingDil) {
      throw new ConflictException("Bu dil kodu zaten mevcut");
    }

    // Varsayılan dil olarak ayarlanacaksa, diğerlerini kaldır
    if (createDilDto.varsayilan) {
      await this.dillerRepository.update({ varsayilan: true }, { varsayilan: false });
    }

    const dil = this.dillerRepository.create(createDilDto);
    return this.dillerRepository.save(dil);
  }

  async findAll(): Promise<Dil[]> {
    return this.dillerRepository.find({
      order: { varsayilan: "DESC", ad: "ASC" },
    });
  }

  async findActive(): Promise<Dil[]> {
    return this.dillerRepository.find({
      where: { durum: 1 },
      order: { varsayilan: "DESC", ad: "ASC" },
    });
  }

  async findOne(id: number): Promise<Dil> {
    const dil = await this.dillerRepository.findOne({ where: { id } });
    if (!dil) {
      throw new NotFoundException(`Dil bulunamadı (ID: ${id})`);
    }
    return dil;
  }

  async findByKod(kod: string): Promise<Dil> {
    const dil = await this.dillerRepository.findOne({ where: { kod } });
    if (!dil) {
      throw new NotFoundException(`Dil bulunamadı (Kod: ${kod})`);
    }
    return dil;
  }

  async findDefault(): Promise<Dil> {
    const dil = await this.dillerRepository.findOne({ where: { varsayilan: true } });
    if (!dil) {
      throw new NotFoundException("Varsayılan dil bulunamadı");
    }
    return dil;
  }

  async update(id: number, updateDilDto: UpdateDilDto): Promise<Dil> {
    const dil = await this.findOne(id);

    // Varsayılan dil olarak ayarlanacaksa, diğerlerini kaldır
    if (updateDilDto.varsayilan) {
      await this.dillerRepository.update(
        { varsayilan: true, id: Not(id) },
        { varsayilan: false }
      );
    }

    Object.assign(dil, updateDilDto);
    return this.dillerRepository.save(dil);
  }

  async remove(id: number): Promise<void> {
    const dil = await this.findOne(id);

    // Varsayılan dil silinemez
    if (dil.varsayilan) {
      throw new ConflictException("Varsayılan dil silinemez");
    }

    await this.dillerRepository.remove(dil);
  }

  async setDefault(id: number): Promise<Dil> {
    const dil = await this.findOne(id);

    // Tüm dillerin varsayılan bayrağını kaldır
    await this.dillerRepository.update({ varsayilan: true }, { varsayilan: false });

    // Seçili dili varsayılan yap
    dil.varsayilan = true;
    return this.dillerRepository.save(dil);
  }
}

