/* eslint-disable prettier/prettier */
import { CreatePropertyDto } from './create-propriedade.dto';

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {
  id: number;
}
