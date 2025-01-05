import { CreateUsuarioAdminDto } from './create-usuario_admin.dto';

export interface UpdateUsuarioAdminDto extends Partial<CreateUsuarioAdminDto> {
  idFirebase: string;
  nome: string;
  email: string;
  senha: string;
}
