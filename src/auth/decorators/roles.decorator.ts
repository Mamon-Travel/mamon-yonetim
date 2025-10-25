import { SetMetadata } from '@nestjs/common';
import { KullaniciTipi } from '../../kullanicilar/enums/kullanici-tipi.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: KullaniciTipi[]) => SetMetadata(ROLES_KEY, roles);














