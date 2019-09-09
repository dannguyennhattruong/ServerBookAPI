import { Address } from '../types/user';

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  password: string;
  userRole?: boolean;
  address?: Address;
}
