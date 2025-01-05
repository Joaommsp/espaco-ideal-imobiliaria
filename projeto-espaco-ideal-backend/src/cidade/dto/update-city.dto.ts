/* eslint-disable prettier/prettier */
import { CreateCityDto } from './create-city.dto';

export interface UpdateCityDto extends Partial<CreateCityDto> {
  id: number;
}
