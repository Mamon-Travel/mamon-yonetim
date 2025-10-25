import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaylasimSablon } from './entities/paylasim-sablon.entity';
import { CreatePaylasimSablonDto } from './dto/create-paylasim-sablon.dto';
import { UpdatePaylasimSablonDto } from './dto/update-paylasim-sablon.dto';
import { GorselIslemService } from '../gorsel-islem/gorsel-islem.service';

@Injectable()
export class PaylasimSablonService {
  constructor(
    @InjectRepository(PaylasimSablon)
    private paylasimSablonRepository: Repository<PaylasimSablon>,
    private gorselIslemService: GorselIslemService,
  ) {}

  async findAll(): Promise<PaylasimSablon[]> {
    return await this.paylasimSablonRepository.find({
      order: { olusturma_tarihi: 'DESC' },
    });
  }

  async findActive(): Promise<PaylasimSablon[]> {
    return await this.paylasimSablonRepository.find({
      where: { durum: 1 },
      order: { sablon_adi: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PaylasimSablon> {
    const sablon = await this.paylasimSablonRepository.findOne({
      where: { id },
    });

    if (!sablon) {
      throw new NotFoundException(`Şablon #${id} bulunamadı`);
    }

    return sablon;
  }

  async create(
    createPaylasimSablonDto: CreatePaylasimSablonDto,
  ): Promise<PaylasimSablon> {
    const sablon = this.paylasimSablonRepository.create(
      createPaylasimSablonDto,
    );
    return await this.paylasimSablonRepository.save(sablon);
  }

  async update(
    id: number,
    updatePaylasimSablonDto: UpdatePaylasimSablonDto,
  ): Promise<PaylasimSablon> {
    await this.findOne(id);
    await this.paylasimSablonRepository.update(id, updatePaylasimSablonDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const sablon = await this.findOne(id);
    await this.paylasimSablonRepository.remove(sablon);
  }

  async createPreview(
    sablonId: number,
    baslik: string,
    aciklama: string,
  ): Promise<string> {
    const sablon = await this.findOne(sablonId);

    const previewUrl = await this.gorselIslemService.createSocialMediaImage(
      baslik,
      aciklama,
      sablon.arka_plan_rengi,
      sablon.logo_url,
    );

    return previewUrl;
  }
}



