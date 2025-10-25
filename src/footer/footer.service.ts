import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FooterMenu } from "./entities/footer-menu.entity";
import { FooterAyar } from "./entities/footer-ayar.entity";
import { CreateFooterMenuDto } from "./dto/create-footer-menu.dto";
import { UpdateFooterMenuDto } from "./dto/update-footer-menu.dto";
import { CreateFooterAyarDto } from "./dto/create-footer-ayar.dto";
import { UpdateFooterAyarDto } from "./dto/update-footer-ayar.dto";

@Injectable()
export class FooterService {
  constructor(
    @InjectRepository(FooterMenu)
    private footerMenuRepository: Repository<FooterMenu>,
    @InjectRepository(FooterAyar)
    private footerAyarRepository: Repository<FooterAyar>
  ) {}

  // ===== FOOTER MENÜLER =====
  async createMenu(createDto: CreateFooterMenuDto): Promise<FooterMenu> {
    const menu = this.footerMenuRepository.create(createDto);
    return this.footerMenuRepository.save(menu);
  }

  async findAllMenus(): Promise<FooterMenu[]> {
    return this.footerMenuRepository.find({
      where: { durum: 1 },
      order: { kategori: "ASC", sira: "ASC" },
    });
  }

  async findMenusByKategori(kategori: string): Promise<FooterMenu[]> {
    return this.footerMenuRepository.find({
      where: { kategori, durum: 1 },
      order: { sira: "ASC" },
    });
  }

  async findOneMenu(id: number): Promise<FooterMenu> {
    const menu = await this.footerMenuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Footer menü bulunamadı (ID: ${id})`);
    }
    return menu;
  }

  async updateMenu(id: number, updateDto: UpdateFooterMenuDto): Promise<FooterMenu> {
    const menu = await this.findOneMenu(id);
    Object.assign(menu, updateDto);
    return this.footerMenuRepository.save(menu);
  }

  async removeMenu(id: number): Promise<void> {
    const menu = await this.findOneMenu(id);
    await this.footerMenuRepository.remove(menu);
  }

  // ===== FOOTER AYARLAR =====
  async createAyar(createDto: CreateFooterAyarDto): Promise<FooterAyar> {
    const ayar = this.footerAyarRepository.create(createDto);
    return this.footerAyarRepository.save(ayar);
  }

  async findAllAyarlar(): Promise<FooterAyar[]> {
    return this.footerAyarRepository.find({
      order: { anahtar: "ASC" },
    });
  }

  async findAyarByAnahtar(anahtar: string): Promise<FooterAyar> {
    const ayar = await this.footerAyarRepository.findOne({ where: { anahtar } });
    if (!ayar) {
      throw new NotFoundException(`Footer ayar bulunamadı (Anahtar: ${anahtar})`);
    }
    return ayar;
  }

  async updateAyar(anahtar: string, updateDto: UpdateFooterAyarDto): Promise<FooterAyar> {
    const ayar = await this.findAyarByAnahtar(anahtar);
    Object.assign(ayar, updateDto);
    return this.footerAyarRepository.save(ayar);
  }

  async removeAyar(anahtar: string): Promise<void> {
    const ayar = await this.findAyarByAnahtar(anahtar);
    await this.footerAyarRepository.remove(ayar);
  }

  // Tüm footer verisini tek seferde getir
  async getFullFooterData(): Promise<{
    menuler: { [key: string]: FooterMenu[] };
    ayarlar: { [key: string]: string };
  }> {
    const menuler = await this.findAllMenus();
    const ayarlar = await this.findAllAyarlar();

    // Menüleri kategoriye göre grupla
    const grupluMenuler = menuler.reduce((acc, menu) => {
      if (!acc[menu.kategori]) {
        acc[menu.kategori] = [];
      }
      acc[menu.kategori].push(menu);
      return acc;
    }, {} as { [key: string]: FooterMenu[] });

    // Ayarları anahtar-değer formatına çevir
    const ayarlarObj = ayarlar.reduce((acc, ayar) => {
      acc[ayar.anahtar] = ayar.deger || "";
      return acc;
    }, {} as { [key: string]: string });

    return {
      menuler: grupluMenuler,
      ayarlar: ayarlarObj,
    };
  }
}

