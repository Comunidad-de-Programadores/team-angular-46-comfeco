import { RecuperarCuentaDto } from './recuperar_cuenta.dto';

export class InicioDto extends RecuperarCuentaDto {
    readonly contrasenia: string;
}