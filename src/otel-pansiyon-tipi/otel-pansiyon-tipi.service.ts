import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtelPansiyonTipi } from './entities/otel-pansiyon-tipi.entity';
import { CreatePansiyonTipiDto } from './dto/create-pansiyon-tipi.dto';
import { UpdatePansiyonTipiDto } from './dto/update-pansiyon-tipi.dto';

@Injectable()
export class OtelPansiyonTipiService {
  constructor(
    @InjectRepository(OtelPansiyonTipi)
    private pansiyonTipiRepository: Repository<OtelPansiyonTipi>,
  ) {}

  async findAll(): Promise<OtelPansiyonTipi[]> {
    return await this.pansiyonTipiRepository.find({
      order: { sira: 'ASC', id: 'ASC' },
    });
  }

  async findActive(): Promise<OtelPansiyonTipi[]> {
    return await this.pansiyonTipiRepository.find({
      where: { durum: 1 },
      order: { sira: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<OtelPansiyonTipi> {
    const pansiyonTipi = await this.pansiyonTipiRepository.findOne({
      where: { id },
    });

    if (!pansiyonTipi) {
      throw new NotFoundException(`Pansiyon tipi #${id} bulunamadı`);
    }

    return pansiyonTipi;
  }

  async findByKod(kod: string): Promise<OtelPansiyonTipi> {
    const pansiyonTipi = await this.pansiyonTipiRepository.findOne({
      where: { kod },
    });

    if (!pansiyonTipi) {
      throw new NotFoundException(`Pansiyon tipi "${kod}" bulunamadı`);
    }

    return pansiyonTipi;
  }

  async create(
    createPansiyonTipiDto: CreatePansiyonTipiDto,
  ): Promise<OtelPansiyonTipi> {
    const pansiyonTipi = this.pansiyonTipiRepository.create(
      createPansiyonTipiDto,
    );
    return await this.pansiyonTipiRepository.save(pansiyonTipi);
  }

  async update(
    id: number,
    updatePansiyonTipiDto: UpdatePansiyonTipiDto,
  ): Promise<OtelPansiyonTipi> {
    await this.findOne(id);
    await this.pansiyonTipiRepository.update(id, updatePansiyonTipiDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const pansiyonTipi = await this.findOne(id);
    await this.pansiyonTipiRepository.remove(pansiyonTipi);
  }
}

