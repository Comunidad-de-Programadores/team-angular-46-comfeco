import { RespuestaGenerica } from './respuesta_generica.dto';

export class TokenDto extends RespuestaGenerica {
    readonly token: string;
    readonly usuario: string;
}