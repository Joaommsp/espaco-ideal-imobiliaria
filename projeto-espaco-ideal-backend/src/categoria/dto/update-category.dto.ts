/* eslint-disable prettier/prettier */
import { CreateCategoryDto } from './create-category.dto';

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  id: number;
}
