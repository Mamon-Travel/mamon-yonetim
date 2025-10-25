import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtelIptalPolitikaService } from './otel-iptal-politika.service';
import { OtelIptalPolitikaController } from './otel-iptal-politika.controller';
import { OtelIptalPolitika } from './entities/otel-iptal-politika.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtelIptalPolitika])],
  controllers: [OtelIptalPolitikaController],
  providers: [OtelIptalPolitikaService],
  exports: [OtelIptalPolitikaService],
})
export class OtelIptalPolitikaModule {}

