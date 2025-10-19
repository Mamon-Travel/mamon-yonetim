import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sepet } from './entities/sepet.entity';
import { Urunler } from '../urunler/entities/urunler.entity';
import { CreateSepetDto } from './dto/create-sepet.dto';
import { UpdateSepetDto } from './dto/update-sepet.dto';

@Injectable()
export class SepetService {
  constructor(
    @InjectRepository(Sepet)
    private sepetRepository: Repository<Sepet>,
    @InjectRepository(Urunler)
    private urunlerRepository: Repository<Urunler>,
  ) {}

  async create(kullaniciId: number, createSepetDto: CreateSepetDto) {
    try {
      const { urunId, miktar = 1, rezervasyonBilgileri } = createSepetDto;

      // Ürünü kontrol et
      const urun = await this.urunlerRepository.findOne({
        where: { id: urunId },
      });

      if (!urun) {
        throw new NotFoundException('Ürün bulunamadı');
      }

      if (urun.stok_durumu === 'tukendi') {
        throw new BadRequestException('Bu ürün stokta yok');
      }

      // Aynı ürün sepette var mı kontrol et
      const mevcutSepetItem = await this.sepetRepository.findOne({
        where: { 
          kullaniciId: kullaniciId,
          urunId: urunId 
        },
      });

      if (mevcutSepetItem) {
        // Varsa miktarı artır
        mevcutSepetItem.miktar += miktar;
        mevcutSepetItem.toplamFiyat = Number(urun.fiyat) * mevcutSepetItem.miktar;
        if (rezervasyonBilgileri) {
          mevcutSepetItem.rezervasyonBilgileri = rezervasyonBilgileri;
        }
        return this.sepetRepository.save(mevcutSepetItem);
      }

      // Yoksa yeni ekle
      const sepetItem = this.sepetRepository.create({
        kullaniciId: kullaniciId,
        urunId: urunId,
        miktar: miktar,
        birimFiyat: Number(urun.fiyat),
        toplamFiyat: Number(urun.fiyat) * miktar,
        rezervasyonBilgileri: rezervasyonBilgileri,
      });

      return await this.sepetRepository.save(sepetItem);
    } catch (error) {
      throw error;
    }
  }

  async findByKullanici(kullaniciId: number) {
    return this.sepetRepository.find({
      where: { kullaniciId: kullaniciId },
      relations: ['urun'],
      order: { olusturmaTarihi: 'DESC' },
    });
  }

  async findOne(id: number, kullaniciId: number) {
    const sepetItem = await this.sepetRepository.findOne({
      where: { 
        id: id, 
        kullaniciId: kullaniciId 
      },
      relations: ['urun'],
    });

    if (!sepetItem) {
      throw new NotFoundException('Sepet öğesi bulunamadı');
    }

    return sepetItem;
  }

  async update(id: number, kullaniciId: number, updateSepetDto: UpdateSepetDto) {
    const sepetItem = await this.findOne(id, kullaniciId);

    if (updateSepetDto.miktar) {
      const urun = await this.urunlerRepository.findOne({
        where: { id: sepetItem.urunId },
      });

      if (!urun) {
        throw new NotFoundException('Ürün bulunamadı');
      }

      sepetItem.miktar = updateSepetDto.miktar;
      sepetItem.toplamFiyat = Number(urun.fiyat) * updateSepetDto.miktar;
    }

    if (updateSepetDto.rezervasyonBilgileri) {
      sepetItem.rezervasyonBilgileri = updateSepetDto.rezervasyonBilgileri;
    }

    return this.sepetRepository.save(sepetItem);
  }

  async remove(id: number, kullaniciId: number) {
    const sepetItem = await this.findOne(id, kullaniciId);
    return this.sepetRepository.remove(sepetItem);
  }

  async clearSepet(kullaniciId: number) {
    const sepetItems = await this.sepetRepository.find({
      where: { kullaniciId: kullaniciId },
    });
    return this.sepetRepository.remove(sepetItems);
  }

  async getSepetToplami(kullaniciId: number) {
    const sepetItems = await this.findByKullanici(kullaniciId);
    
    const toplam = sepetItems.reduce((sum, item) => {
      return sum + Number(item.toplamFiyat);
    }, 0);

    return {
      adetSayisi: sepetItems.length,
      toplamTutar: toplam,
      sepetItems,
    };
  }
}

