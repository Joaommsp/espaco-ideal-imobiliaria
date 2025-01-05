import { CreatePropriedadeDto } from './create-propriedade.dto';

export interface UpdatePropriedadeDto extends Partial<CreatePropriedadeDto> {
  titulo: string;
  descricao: string;
  local: string;
  preco: number;
}
