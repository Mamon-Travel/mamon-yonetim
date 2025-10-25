import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SiteOzellik } from "./entities/site-ozellik.entity";
import { CreateSiteOzellikDto } from "./dto/create-site-ozellik.dto";
import { UpdateSiteOzellikDto } from "./dto/update-site-ozellik.dto";

@Injectable()
export class SiteOzellikleriService {
  constructor(
    @InjectRepository(SiteOzellik)
    private siteOzellikleriRepository: Repository<SiteOzellik>
  ) {}

  async create(createDto: CreateSiteOzellikDto): Promise<SiteOzellik> {
    const ozellik = this.siteOzellikleriRepository.create(createDto);
    return this.siteOzellikleriRepository.save(ozellik);
  }

  async findAll(): Promise<SiteOzellik[]> {
    return this.siteOzellikleriRepository.find({
      where: { durum: 1 },
      order: { sayfa: "ASC", sira: "ASC" },
    });
  }

  async findBySayfa(sayfa: string): Promise<SiteOzellik[]> {
    return this.siteOzellikleriRepository.find({
      where: { sayfa, durum: 1 },
      order: { sira: "ASC" },
    });
  }

  async findOne(id: number): Promise<SiteOzellik> {
    const ozellik = await this.siteOzellikleriRepository.findOne({
      where: { id },
    });

    if (!ozellik) {
      throw new NotFoundException(`Site özelliği bulunamadı (ID: ${id})`);
    }

    return ozellik;
  }

  async update(id: number, updateDto: UpdateSiteOzellikDto): Promise<SiteOzellik> {
    const ozellik = await this.findOne(id);
    Object.assign(ozellik, updateDto);
    return this.siteOzellikleriRepository.save(ozellik);
  }

  async remove(id: number): Promise<void> {
    const ozellik = await this.findOne(id);
    await this.siteOzellikleriRepository.remove(ozellik);
  }
}

