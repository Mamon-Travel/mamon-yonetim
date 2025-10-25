import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtelIptalPolitika } from './entities/otel-iptal-politika.entity';
import { CreateIptalPolitikaDto } from './dto/create-iptal-politika.dto';
import { UpdateIptalPolitikaDto } from './dto/update-iptal-politika.dto';

@Injectable()
export class OtelIptalPolitikaService {
  constructor(
    @InjectRepository(OtelIptalPolitika)
    private iptalPolitikaRepository: Repository<OtelIptalPolitika>,
  ) {}

  async findAll(): Promise<OtelIptalPolitika[]> {
    return await this.iptalPolitikaRepository.find({
      relations: ['otel'],
      order: { otel_id: 'ASC', sira: 'ASC' },
    });
  }

  async findByOtelId(otelId: number): Promise<OtelIptalPolitika[]> {
    return await this.iptalPolitikaRepository.find({
      where: { otel_id: otelId, durum: 1 },
      order: { sira: 'ASC', gun_oncesi: 'DESC' },
    });
  }

  async getApplicablePolicy(
    otelId: number,
    gunOncesi: number,
  ): Promise<OtelIptalPolitika | null> {
    const policies = await this.findByOtelId(otelId);

    for (const policy of policies) {
      if (gunOncesi >= policy.gun_oncesi) {
        return policy;
      }
    }

    return policies.length > 0 ? policies[policies.length - 1] : null;
  }

  async findOne(id: number): Promise<OtelIptalPolitika> {
    const iptalPolitika = await this.iptalPolitikaRepository.findOne({
      where: { id },
      relations: ['otel'],
    });

    if (!iptalPolitika) {
      throw new NotFoundException(`İptal politikası #${id} bulunamadı`);
    }

    return iptalPolitika;
  }

  async create(
    createIptalPolitikaDto: CreateIptalPolitikaDto,
  ): Promise<OtelIptalPolitika> {
    const iptalPolitika = this.iptalPolitikaRepository.create(
      createIptalPolitikaDto,
    );
    return await this.iptalPolitikaRepository.save(iptalPolitika);
  }

  async update(
    id: number,
    updateIptalPolitikaDto: UpdateIptalPolitikaDto,
  ): Promise<OtelIptalPolitika> {
    await this.findOne(id);
    await this.iptalPolitikaRepository.update(id, updateIptalPolitikaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const iptalPolitika = await this.findOne(id);
    await this.iptalPolitikaRepository.remove(iptalPolitika);
  }
}

