import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { Kullanicilar } from '../kullanicilar/entities/kullanicilar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kullanicilar]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mamon-travel-secret-key-2025',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

