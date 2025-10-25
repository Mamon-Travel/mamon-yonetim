import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';
import { FileManager } from './entities/file-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileManager])],
  controllers: [FileManagerController],
  providers: [FileManagerService],
  exports: [FileManagerService],
})
export class FileManagerModule {}

