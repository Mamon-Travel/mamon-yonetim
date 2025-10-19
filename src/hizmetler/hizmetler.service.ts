import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hizmetler } from './entities/hizmetler.entity';
import { CreateHizmetlerDto } from './dto/create-hizmetler.dto';
import { UpdateHizmetlerDto } from './dto/update-hizmetler.dto';

@Injectable()
export class HizmetlerService {
  constructor(
    @InjectRepository(Hizmetler)
    private hizmetlerRepository: Repository<Hizmetler>,
  ) {}

  async create(createHizmetlerDto: CreateHizmetlerDto): Promise<Hizmetler> {
    const hizmet = this.hizmetlerRepository.create(createHizmetlerDto);
    return await this.hizmetlerRepository.save(hizmet);
  }

  async findAll(): Promise<Hizmetler[]> {
    return await this.hizmetlerRepository.find({
      order: { sira: 'ASC' }
    });
  }

  async findActive(): Promise<Hizmetler[]> {
    return await this.hizmetlerRepository.find({
      where: { aktif: true },
      order: { sira: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Hizmetler> {
    const hizmet = await this.hizmetlerRepository.findOne({ where: { id } });
    if (!hizmet) {
      throw new NotFoundException(`ID ${id} olan hizmet bulunamadı`);
    }
    return hizmet;
  }

  async findBySlug(slug: string): Promise<Hizmetler> {
    const hizmet = await this.hizmetlerRepository.findOne({ where: { slug } });
    if (!hizmet) {
      throw new NotFoundException(`Slug '${slug}' olan hizmet bulunamadı`);
    }
    return hizmet;
  }

  async update(id: number, updateHizmetlerDto: UpdateHizmetlerDto): Promise<Hizmetler> {
    const hizmet = await this.findOne(id);
    Object.assign(hizmet, updateHizmetlerDto);
    return await this.hizmetlerRepository.save(hizmet);
  }

  async remove(id: number): Promise<void> {
    const hizmet = await this.findOne(id);
    await this.hizmetlerRepository.remove(hizmet);
  }

  async toggleActive(id: number): Promise<Hizmetler> {
    const hizmet = await this.findOne(id);
    hizmet.aktif = !hizmet.aktif;
    return await this.hizmetlerRepository.save(hizmet);
  }
}
