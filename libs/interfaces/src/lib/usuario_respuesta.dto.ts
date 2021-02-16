import { Rol } from '../enum/roles.enum';
import { RespuestaGenerica } from './respuesta_generica.dto';

export class UsuarioDto extends RespuestaGenerica {
    readonly nombre?:string;
    readonly apellido_paterno?:string;
    readonly apellido_materno?:string;
    readonly usuario: string;
    readonly correo: string;
    readonly roles: Rol[];
}