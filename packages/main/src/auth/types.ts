import { UserRolesEnum } from '../user/types';

export interface TokenPayload {
  id: number;
  email: string;
  role: UserRolesEnum;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
