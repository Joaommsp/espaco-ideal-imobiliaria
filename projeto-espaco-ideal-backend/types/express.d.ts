/* eslint-disable prettier/prettier */
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: any; // Altere `any` para o tipo específico do usuário se você souber o tipo exato
  }
}
