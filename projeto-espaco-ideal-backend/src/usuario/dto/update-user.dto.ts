/* eslint-disable prettier/prettier */
import { CreateUserDto } from './create-user.dto';

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: string;
}
