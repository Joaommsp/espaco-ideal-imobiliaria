import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioClienteDto } from './create-usuario_cliente.dto';

export interface UpdateUsuarioClienteDto extends Partial<CreateUsuarioClienteDto> {
    idFirebase: string;
    nome: string;
    email: string;
    senha: string;
}
