import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { CreateOtelDto } from "./dto/create-otel.dto";
import { UpdateOtelDto } from "./dto/update-otel.dto";
import { CreateOdaTipiDto } from "./dto/create-oda-tipi.dto";
import { UpdateOdaTipiDto } from "./dto/update-oda-tipi.dto";
import { UploadGorselDto } from "./dto/upload-gorsel.dto";
import { Otel } from "./entities/otel.entity";
import { OtelDetay } from "./entities/otel-detay.entity";
import { OtelOdaTipi } from "./entities/otel-oda-tipi.entity";
import { OtelGorsel } from "./entities/otel-gorsel.entity";

@Injectable()
export class OtelService {
  constructor(
    @InjectRepository(Otel)
    private readonly otelRepository: Repository<Otel>,
    @InjectRepository(OtelDetay)
    private readonly otelDetayRepository: Repository<OtelDetay>,
    @InjectRepository(OtelOdaTipi)
    private readonly odaTipiRepository: Repository<OtelOdaTipi>,
    @InjectRepository(OtelGorsel)
    private readonly gorselRepository: Repository<OtelGorsel>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createOtelDto: CreateOtelDto): Promise<Otel> {
    // Detay bilgisini ayır
    const { detay, otelOzellikIds, ...otelData } = createOtelDto;

    // Önce oteli oluştur
    const otel = this.otelRepository.create(otelData);
    const savedOtel = await this.otelRepository.save(otel);

    // Detay varsa oluştur
    if (detay) {
      const otelDetay = this.otelDetayRepository.create({
        ...detay,
        otel_id: savedOtel.id,
      });
      await this.otelDetayRepository.save(otelDetay);
    }

    // Otel özelliklerini ilişkilendir
    if (otelOzellikIds && otelOzellikIds.length > 0) {
      for (const ozellikId of otelOzellikIds) {
        await this.dataSource.query(
          `INSERT INTO otel_otel_ozellik_iliski (otel_id, otel_ozellik_id) 
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [savedOtel.id, ozellikId]
        );
      }
    }

    return this.findOne(savedOtel.id);
  }

  async findAll(): Promise<Otel[]> {
    return await this.otelRepository.find({
      relations: ["detay", "gorseller", "odaTipleri"],
      order: {
        id: "DESC",
      },
    });
  }

  async findActive(): Promise<Otel[]> {
    return await this.otelRepository.find({
      where: { durum: 1 },
      relations: ["detay", "gorseller"],
      order: {
        id: "DESC",
      },
    });
  }

  async findOne(id: number): Promise<Otel> {
    const otel = await this.otelRepository.findOne({
      where: { id },
      relations: ["detay", "gorseller", "odaTipleri"],
    });

    if (!otel) {
      throw new NotFoundException(`Otel #${id} bulunamadı`);
    }

    // Otel özelliklerini getir
    const ozellikler = await this.dataSource.query(
      `SELECT oo.* FROM otel_ozellik oo
       INNER JOIN otel_otel_ozellik_iliski oooi ON oo.id = oooi.otel_ozellik_id
       WHERE oooi.otel_id = $1
       ORDER BY oo.sira, oo.id`,
      [id]
    );

    (otel as any).otelOzellikleri = ozellikler;

    return otel;
  }

  async findBySlug(slug: string): Promise<Otel> {
    const otel = await this.otelRepository.findOne({
      where: { slug },
      relations: ["detay", "gorseller", "odaTipleri"],
    });

    if (!otel) {
      throw new NotFoundException(`Otel bulunamadı: ${slug}`);
    }

    return otel;
  }

  async update(id: number, updateOtelDto: UpdateOtelDto): Promise<Otel> {
    const otel = await this.otelRepository.findOne({ where: { id } });

    if (!otel) {
      throw new NotFoundException(`Otel #${id} bulunamadı`);
    }

    const { detay, otelOzellikIds, ...otelData } = updateOtelDto;

    // Otel bilgilerini güncelle
    Object.assign(otel, otelData);
    await this.otelRepository.save(otel);

    // Detay varsa güncelle
    if (detay) {
      const otelDetay = await this.otelDetayRepository.findOne({
        where: { otel_id: id },
      });

      if (otelDetay) {
        Object.assign(otelDetay, detay);
        await this.otelDetayRepository.save(otelDetay);
      } else {
        const newDetay = this.otelDetayRepository.create({
          ...detay,
          otel_id: id,
        });
        await this.otelDetayRepository.save(newDetay);
      }
    }

    // Otel özelliklerini güncelle
    if (otelOzellikIds !== undefined) {
      // Önce mevcut ilişkileri sil
      await this.dataSource.query(
        `DELETE FROM otel_otel_ozellik_iliski WHERE otel_id = $1`,
        [id]
      );

      // Yeni ilişkileri ekle
      if (otelOzellikIds.length > 0) {
        for (const ozellikId of otelOzellikIds) {
          await this.dataSource.query(
            `INSERT INTO otel_otel_ozellik_iliski (otel_id, otel_ozellik_id) 
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, ozellikId]
          );
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const otel = await this.otelRepository.findOne({ where: { id } });

    if (!otel) {
      throw new NotFoundException(`Otel #${id} bulunamadı`);
    }

    await this.otelRepository.remove(otel);
  }

  // Oda Tipi CRUD
  async createOdaTipi(createOdaTipiDto: CreateOdaTipiDto): Promise<OtelOdaTipi> {
    const { odaOzellikIds, ...odaTipiData } = createOdaTipiDto;

    // Otelin varlığını kontrol et
    const otel = await this.otelRepository.findOne({
      where: { id: odaTipiData.otel_id },
    });
    if (!otel) {
      throw new NotFoundException(`Otel #${odaTipiData.otel_id} bulunamadı`);
    }

    // Oda tipini oluştur
    const odaTipi = this.odaTipiRepository.create(odaTipiData);
    const savedOdaTipi = await this.odaTipiRepository.save(odaTipi);

    // Oda özelliklerini ilişkilendir
    if (odaOzellikIds && odaOzellikIds.length > 0) {
      for (const ozellikId of odaOzellikIds) {
        await this.dataSource.query(
          `INSERT INTO otel_oda_tipi_ozellik_iliski (oda_tipi_id, oda_ozellik_id) 
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [savedOdaTipi.id, ozellikId]
        );
      }
    }

    return this.findOneOdaTipi(savedOdaTipi.id);
  }

  async findOdaTipleriByOtelId(otelId: number): Promise<OtelOdaTipi[]> {
    const odaTipleri = await this.odaTipiRepository.find({
      where: { otel_id: otelId },
      order: { id: "ASC" },
    });

    // Her oda tipi için özelliklerini getir
    for (const odaTipi of odaTipleri) {
      const ozellikler = await this.dataSource.query(
        `SELECT oo.* FROM otel_oda_ozellik oo
         INNER JOIN otel_oda_tipi_ozellik_iliski otoo ON oo.id = otoo.oda_ozellik_id
         WHERE otoo.oda_tipi_id = $1
         ORDER BY oo.sira, oo.id`,
        [odaTipi.id]
      );
      (odaTipi as any).odaOzellikleri = ozellikler;
    }

    return odaTipleri;
  }

  async findOneOdaTipi(id: number): Promise<OtelOdaTipi> {
    const odaTipi = await this.odaTipiRepository.findOne({
      where: { id },
    });

    if (!odaTipi) {
      throw new NotFoundException(`Oda tipi #${id} bulunamadı`);
    }

    // Oda özelliklerini getir
    const ozellikler = await this.dataSource.query(
      `SELECT oo.* FROM otel_oda_ozellik oo
       INNER JOIN otel_oda_tipi_ozellik_iliski otoo ON oo.id = otoo.oda_ozellik_id
       WHERE otoo.oda_tipi_id = $1
       ORDER BY oo.sira, oo.id`,
      [id]
    );

    (odaTipi as any).odaOzellikleri = ozellikler;

    return odaTipi;
  }

  async updateOdaTipi(
    id: number,
    updateOdaTipiDto: UpdateOdaTipiDto
  ): Promise<OtelOdaTipi> {
    const odaTipi = await this.odaTipiRepository.findOne({ where: { id } });

    if (!odaTipi) {
      throw new NotFoundException(`Oda tipi #${id} bulunamadı`);
    }

    const { odaOzellikIds, ...odaTipiData } = updateOdaTipiDto;

    // Oda tipi bilgilerini güncelle
    Object.assign(odaTipi, odaTipiData);
    await this.odaTipiRepository.save(odaTipi);

    // Oda özelliklerini güncelle
    if (odaOzellikIds !== undefined) {
      // Önce mevcut ilişkileri sil
      await this.dataSource.query(
        `DELETE FROM otel_oda_tipi_ozellik_iliski WHERE oda_tipi_id = $1`,
        [id]
      );

      // Yeni ilişkileri ekle
      if (odaOzellikIds.length > 0) {
        for (const ozellikId of odaOzellikIds) {
          await this.dataSource.query(
            `INSERT INTO otel_oda_tipi_ozellik_iliski (oda_tipi_id, oda_ozellik_id) 
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, ozellikId]
          );
        }
      }
    }

    return this.findOneOdaTipi(id);
  }

  async removeOdaTipi(id: number): Promise<void> {
    const odaTipi = await this.odaTipiRepository.findOne({ where: { id } });

    if (!odaTipi) {
      throw new NotFoundException(`Oda tipi #${id} bulunamadı`);
    }

    // İlişkileri sil
    await this.dataSource.query(
      `DELETE FROM otel_oda_tipi_ozellik_iliski WHERE oda_tipi_id = $1`,
      [id]
    );

    await this.odaTipiRepository.remove(odaTipi);
  }

  // Görsel Yönetimi
  async uploadGorsel(uploadGorselDto: UploadGorselDto): Promise<OtelGorsel> {
    // Otelin varlığını kontrol et
    const otel = await this.otelRepository.findOne({
      where: { id: uploadGorselDto.otel_id },
    });
    if (!otel) {
      throw new NotFoundException(`Otel #${uploadGorselDto.otel_id} bulunamadı`);
    }

    const gorsel = this.gorselRepository.create(uploadGorselDto);
    return await this.gorselRepository.save(gorsel);
  }

  async getOtelGorselleri(otelId: number): Promise<OtelGorsel[]> {
    return await this.gorselRepository.find({
      where: { otel_id: otelId },
      order: { sira: "ASC", id: "ASC" },
    });
  }

  async deleteGorsel(id: number): Promise<void> {
    const gorsel = await this.gorselRepository.findOne({ where: { id } });
    if (!gorsel) {
      throw new NotFoundException(`Görsel #${id} bulunamadı`);
    }
    await this.gorselRepository.remove(gorsel);
  }

  async updateGorselSira(id: number, sira: number): Promise<OtelGorsel> {
    const gorsel = await this.gorselRepository.findOne({ where: { id } });
    if (!gorsel) {
      throw new NotFoundException(`Görsel #${id} bulunamadı`);
    }
    gorsel.sira = sira;
    return await this.gorselRepository.save(gorsel);
  }
}

