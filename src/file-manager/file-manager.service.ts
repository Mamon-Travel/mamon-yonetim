import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFileManagerDto } from "./dto/create-file-manager.dto";
import { UpdateFileManagerDto } from "./dto/update-file-manager.dto";
import { FileManager } from "./entities/file-manager.entity";
import * as fs from "fs/promises";
import * as path from "path";

@Injectable()
export class FileManagerService {
  constructor(
    @InjectRepository(FileManager)
    private readonly fileManagerRepository: Repository<FileManager>,
  ) {}

  async create(
    createFileManagerDto: CreateFileManagerDto,
  ): Promise<FileManager> {
    const file = this.fileManagerRepository.create(createFileManagerDto);
    return await this.fileManagerRepository.save(file);
  }

  async findAll(): Promise<FileManager[]> {
    return await this.fileManagerRepository.find({
      order: {
        olusturma_tarihi: "DESC",
      },
    });
  }

  async findByCategory(kategori: string): Promise<FileManager[]> {
    return await this.fileManagerRepository.find({
      where: { kategori },
      order: {
        olusturma_tarihi: "DESC",
      },
    });
  }

  async findOne(id: number): Promise<FileManager> {
    const file = await this.fileManagerRepository.findOne({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException(`Dosya #${id} bulunamadı`);
    }

    return file;
  }

  async update(
    id: number,
    updateFileManagerDto: UpdateFileManagerDto,
  ): Promise<FileManager> {
    const file = await this.findOne(id);
    Object.assign(file, updateFileManagerDto);
    return await this.fileManagerRepository.save(file);
  }

  async remove(id: number): Promise<void> {
    const file = await this.findOne(id);

    // Fiziksel dosyayı sil
    try {
      const fullPath = path.join(process.cwd(), file.dosya_yolu);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error("Fiziksel dosya silinirken hata:", error);
    }

    // Veritabanından sil
    await this.fileManagerRepository.remove(file);
  }

  async incrementViewCount(id: number): Promise<void> {
    const file = await this.findOne(id);
    file.goruntuleme_sayisi += 1;
    await this.fileManagerRepository.save(file);
  }

  async incrementDownloadCount(id: number): Promise<void> {
    const file = await this.findOne(id);
    file.indirme_sayisi += 1;
    await this.fileManagerRepository.save(file);
  }
}