import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOtelOzellikDto } from "./dto/create-otel-ozellik.dto";
import { UpdateOtelOzellikDto } from "./dto/update-otel-ozellik.dto";
import { OtelOzellik } from "./entities/otel-ozellik.entity";

@Injectable()
export class OtelOzellikService {
  constructor(
    @InjectRepository(OtelOzellik)
    private readonly otelOzellikRepository: Repository<OtelOzellik>,
  ) {}

  async create(
    createOtelOzellikDto: CreateOtelOzellikDto,
  ): Promise<OtelOzellik> {
    const ozellik = this.otelOzellikRepository.create(createOtelOzellikDto);
    return await this.otelOzellikRepository.save(ozellik);
  }

  async findAll(): Promise<OtelOzellik[]> {
    return await this.otelOzellikRepository.find({
      order: {
        sira: "ASC",
        id: "ASC",
      },
    });
  }

  async findActive(): Promise<OtelOzellik[]> {
    return await this.otelOzellikRepository.find({
      where: { durum: 1 },
      order: {
        sira: "ASC",
        id: "ASC",
      },
    });
  }

  async findOne(id: number): Promise<OtelOzellik> {
    const ozellik = await this.otelOzellikRepository.findOne({
      where: { id },
    });

    if (!ozellik) {
      throw new NotFoundException(`Otel özelliği #${id} bulunamadı`);
    }

    return ozellik;
  }

  async update(
    id: number,
    updateOtelOzellikDto: UpdateOtelOzellikDto,
  ): Promise<OtelOzellik> {
    const ozellik = await this.findOne(id);
    Object.assign(ozellik, updateOtelOzellikDto);
    return await this.otelOzellikRepository.save(ozellik);
  }

  async remove(id: number): Promise<void> {
    const ozellik = await this.findOne(id);
    await this.otelOzellikRepository.remove(ozellik);
  }
}









