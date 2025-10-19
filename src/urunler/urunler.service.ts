import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUrunlerDto } from './dto/create-urunler.dto';
import { UpdateUrunlerDto } from './dto/update-urunler.dto';
import { Urunler } from './entities/urunler.entity';

@Injectable()
export class UrunlerService {
  constructor(
    @InjectRepository(Urunler)
    private readonly urunlerRepository: Repository<Urunler>,
  ) {}

  async create(createUrunlerDto: CreateUrunlerDto): Promise<Urunler> {
    const urun = this.urunlerRepository.create(createUrunlerDto);
    return await this.urunlerRepository.save(urun);
  }

  async findAll(hizmetId?: number): Promise<Urunler[]> {
    const query = this.urunlerRepository
      .createQueryBuilder('urun')
      .leftJoinAndSelect('urun.hizmet', 'hizmet')
      .orderBy('urun.id', 'DESC');

    if (hizmetId) {
      query.where('urun.hizmet_id = :hizmetId', { hizmetId });
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<Urunler> {
    const urun = await this.urunlerRepository.findOne({
      where: { id },
      relations: ['hizmet'],
    });

    if (!urun) {
      throw new NotFoundException(`Ürün #${id} bulunamadı`);
    }

    return urun;
  }

  async findBySlug(slug: string): Promise<Urunler> {
    const urun = await this.urunlerRepository.findOne({
      where: { slug },
      relations: ['hizmet'],
    });

    if (!urun) {
      throw new NotFoundException('Ürün bulunamadı');
    }

    return urun;
  }

  async findByHizmet(hizmetId: number): Promise<Urunler[]> {
    return await this.urunlerRepository.find({
      where: { hizmet_id: hizmetId, durum: 1 },
      relations: ['hizmet'],
      order: { id: 'DESC' },
    });
  }

  async update(
    id: number,
    updateUrunlerDto: UpdateUrunlerDto,
  ): Promise<Urunler> {
    const urun = await this.findOne(id);
    Object.assign(urun, updateUrunlerDto);
    return await this.urunlerRepository.save(urun);
  }

  async remove(id: number): Promise<void> {
    const urun = await this.findOne(id);
    await this.urunlerRepository.remove(urun);
  }

  // Stok durumu güncelleme
  async updateStokDurumu(
    id: number,
    stokDurumu: string,
  ): Promise<Urunler> {
    const urun = await this.findOne(id);
    urun.stok_durumu = stokDurumu as any;
    return await this.urunlerRepository.save(urun);
  }
}

