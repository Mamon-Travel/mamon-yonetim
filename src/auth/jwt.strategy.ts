import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export interface JwtPayload {
  sub: number;
  kullanici_adi: string;
  email: string;
  kullanici_tipi: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mamon-travel-secret-key-2025',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,  // userId olarak döndür
      id: payload.sub,      // Geriye uyumluluk için id de ekle
      kullanici_adi: payload.kullanici_adi,
      email: payload.email,
      kullanici_tipi: payload.kullanici_tipi,
    };
  }
}



