/* eslint-disable prettier/prettier */
import { CreateTransactionDto } from './create-transacao.dto';

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {
  id: number;
}
