import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAnamenuAltDto } from "./dto/create-anamenu-alt.dto";
import { UpdateAnamenuAltDto } from "./dto/update-anamenu-alt.dto";
import { AnamenuAlt } from "./entities/anamenu-alt.entity";

@Injectable()
export class AnamenuAltService {
  constructor(
    @InjectRepository(AnamenuAlt)
    private anamenuAltRepository: Repository<AnamenuAlt>,
  ) {}

  async create(createAnamenuAltDto: CreateAnamenuAltDto): Promise<AnamenuAlt> {
    const anamenuAlt = this.anamenuAltRepository.create(createAnamenuAltDto);
    return await this.anamenuAltRepository.save(anamenuAlt);
  }

  async findAll(): Promise<AnamenuAlt[]> {
    return await this.anamenuAltRepository.find({
      relations: ["anamenu", "menuler"],
      order: { sira: "ASC" },
    });
  }

  async findByAnamenuId(anamenuId: number): Promise<AnamenuAlt[]> {
    return await this.anamenuAltRepository.find({
      where: { anamenu_id: anamenuId },
      relations: ["menuler"],
      order: { sira: "ASC" },
    });
  }

  async findOne(id: number): Promise<AnamenuAlt> {
    const anamenuAlt = await this.anamenuAltRepository.findOne({
      where: { id },
      relations: ["anamenu", "menuler"],
    });

    if (!anamenuAlt) {
      throw new NotFoundException(`ID ${id} ile alt menü bulunamadı`);
    }

    return anamenuAlt;
  }

  async update(
    id: number,
    updateAnamenuAltDto: UpdateAnamenuAltDto,
  ): Promise<AnamenuAlt> {
    const anamenuAlt = await this.findOne(id);
    Object.assign(anamenuAlt, updateAnamenuAltDto);
    return await this.anamenuAltRepository.save(anamenuAlt);
  }

  async remove(id: number): Promise<void> {
    const anamenuAlt = await this.findOne(id);
    await this.anamenuAltRepository.remove(anamenuAlt);
  }
}

