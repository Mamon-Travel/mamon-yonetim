import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOtelOdaOzellikDto } from "./dto/create-otel-oda-ozellik.dto";
import { UpdateOtelOdaOzellikDto } from "./dto/update-otel-oda-ozellik.dto";
import { OtelOdaOzellik } from "./entities/otel-oda-ozellik.entity";

@Injectable()
export class OtelOdaOzellikService {
  constructor(
    @InjectRepository(OtelOdaOzellik)
    private readonly otelOdaOzellikRepository: Repository<OtelOdaOzellik>,
  ) {}

  async create(
    createOtelOdaOzellikDto: CreateOtelOdaOzellikDto,
  ): Promise<OtelOdaOzellik> {
    const ozellik = this.otelOdaOzellikRepository.create(
      createOtelOdaOzellikDto,
    );
    return await this.otelOdaOzellikRepository.save(ozellik);
  }

  async findAll(): Promise<OtelOdaOzellik[]> {
    return await this.otelOdaOzellikRepository.find({
      order: {
        sira: "ASC",
        id: "ASC",
      },
    });
  }

  async findActive(): Promise<OtelOdaOzellik[]> {
    return await this.otelOdaOzellikRepository.find({
      where: { durum: 1 },
      order: {
        sira: "ASC",
        id: "ASC",
      },
    });
  }

  async findOne(id: number): Promise<OtelOdaOzellik> {
    const ozellik = await this.otelOdaOzellikRepository.findOne({
      where: { id },
    });

    if (!ozellik) {
      throw new NotFoundException(`Oda özelliği #${id} bulunamadı`);
    }

    return ozellik;
  }

  async update(
    id: number,
    updateOtelOdaOzellikDto: UpdateOtelOdaOzellikDto,
  ): Promise<OtelOdaOzellik> {
    const ozellik = await this.findOne(id);
    Object.assign(ozellik, updateOtelOdaOzellikDto);
    return await this.otelOdaOzellikRepository.save(ozellik);
  }

  async remove(id: number): Promise<void> {
    const ozellik = await this.findOne(id);
    await this.otelOdaOzellikRepository.remove(ozellik);
  }
}


