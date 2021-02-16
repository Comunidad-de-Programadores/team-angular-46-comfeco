import { RespuestaGenerica, UsuarioDto } from '@comfeco/interfaces';
import { HttpStatus, Injectable } from '@nestjs/common';

import { RespuestaUtil, ValidarServicio } from '@comfeco/validator';

import { UsuarioEntidad } from './usuario.entity';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {

    constructor(private _usuarioRepository: UsuarioRepository){}

    async informacionUsuario(usuario:string): Promise<UsuarioDto | RespuestaGenerica> {
        let validacion:RespuestaGenerica;
        
        validacion = ValidarServicio.usuario(usuario, validacion);
        if(validacion!=null) return validacion;
        
        const usuarioEntidad:UsuarioEntidad = await this._usuarioRepository.validarExistenciaUsuario(usuario);

        if(usuarioEntidad==null) {
            return RespuestaUtil.respuestaGenerica('',['El usuario no tiene información en la base de datos'], HttpStatus.BAD_REQUEST);
        }

        const { nombre, apellido_paterno, apellido_materno, correo, roles } = usuarioEntidad;

        const usuarioInformacion:UsuarioDto = {
            codigo: HttpStatus.OK,
            nombre,
            apellido_paterno,
            apellido_materno,
            usuario,
            correo,
            roles
        };
        
        return usuarioInformacion;
    }
    
}
