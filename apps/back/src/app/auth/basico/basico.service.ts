import { Injectable, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Estatus, RespuestaGenerica, RegistroDto, TokenDto, InicioDto } from '@comfeco/interfaces';

import { AuthService } from '../auth.service';
import { UsuarioEntidad } from './../../usuario/usuario.entity';
import { UsuarioRepository } from './../../usuario/usuario.repository';
import { RespuestaUtil } from '../../../util/general/respuestas.util';

@Injectable()
export class BasicoService {

    constructor(
        private _usuarioRepository: UsuarioRepository,
        private _authService: AuthService
    ) {}
    
    async registro(registroDto:RegistroDto): Promise<TokenDto | RespuestaGenerica> {
        const { usuario, correo, terminos } = registroDto;

        if(!terminos) {
            return RespuestaUtil.respuestaGenerica('',['Es necesario aceptar las políticas de privacidad, así como los términos y condiciones'], HttpStatus.BAD_REQUEST);
        }

        let mensajeError:string;
        let usuarioBase:UsuarioEntidad = await this._usuarioRepository.validarExistenciaUsuario(usuario);

        if(usuarioBase!=null) {
            mensajeError = 'El usuario ya se encuentra registrado';
        } else {
            usuarioBase = await this._usuarioRepository.validarExistenciaCorreo(correo);

            if(usuarioBase!=null) {
                mensajeError = 'El correo ya se encuentra registrado';
            }
        }

        if(mensajeError) {
            return RespuestaUtil.respuestaGenerica('',[mensajeError], HttpStatus.BAD_REQUEST);
        }

        const token:TokenDto = this._authService.crearTokenAcceso(usuario, correo, HttpStatus.CREATED);

        await this._usuarioRepository.registrarUsuarioCorreo(registroDto, token.token);

        return token;
    }

    async existeUsuario(inicioDto:InicioDto): Promise<TokenDto | RespuestaGenerica> {
        const { usuario, correo, contrasenia } = inicioDto;

        if(!usuario && !correo) {
            return RespuestaUtil.respuestaGenerica('',['Es necesario enviar el usuario o el correo para poder validar las credenciales'], HttpStatus.UNAUTHORIZED);
        }

        const usuarioEntidad:UsuarioEntidad = await this._validarExistenciaUsuarioCorreo(usuario, correo);
        
        if(usuarioEntidad==null) {
            return RespuestaUtil.respuestaGenerica('',['Credenciales incorrectas'], HttpStatus.UNAUTHORIZED);
        }

        if(usuarioEntidad.estatus!=Estatus.ACTIVO) {
            return RespuestaUtil.respuestaGenerica('',['El usuario ha sido dado de baja temporalmente'], HttpStatus.UNAUTHORIZED);
        }
        
        const { mensaje } = await this._compararContrasenias(contrasenia, usuarioEntidad);
        
        if(mensaje) {
            return RespuestaUtil.respuestaGenerica('',[mensaje], HttpStatus.UNAUTHORIZED);
        }

        const token:TokenDto = this._authService.crearTokenAcceso(usuarioEntidad.usuario, usuarioEntidad.correo, HttpStatus.OK);

        usuarioEntidad.tokenApi = token.token;

        await this._usuarioRepository.actualizarTokenUsuario(usuarioEntidad);

        return token;
    }

    private async _validarExistenciaUsuarioCorreo(usuario:string, correo:string): Promise<UsuarioEntidad> {
        let usuarioEntidad:UsuarioEntidad;

        if(usuario) {
            usuarioEntidad = await this._usuarioRepository.validarExistenciaUsuario(usuario);
        } else if(correo) {
            usuarioEntidad = await this._usuarioRepository.validarExistenciaCorreo(correo);
        } else {
            return null;
        }

        return usuarioEntidad;
    }

    private async _compararContrasenias(contrasenia:string, usuarioEntidad:UsuarioEntidad): Promise<RespuestaGenerica> {
        let mensaje:String;

        if(usuarioEntidad==null) {
            mensaje = 'Credenciales invalidas';
        } else {
            const contraseniaCorrecta = await bcrypt.compare(contrasenia, usuarioEntidad.contrasenia);
            
            if(!contraseniaCorrecta) {
                mensaje = 'Credenciales invalidas';
            }
        }

        return new Promise((resolver) => {
            resolver({
                mensaje
            } as RespuestaGenerica);
        });
    }

    async renovarToken(usuario:string, token:string): Promise<TokenDto | RespuestaGenerica> {
        const usuarioBase:UsuarioEntidad = await this._usuarioRepository.validarExistenciaUsuario(usuario);

        if(usuarioBase==null || usuarioBase.tokenApi!==token) {
            return RespuestaUtil.respuestaGenerica('',['Usuario invalido'], HttpStatus.UNAUTHORIZED);
        }

        const tokenNuevo:TokenDto = this._authService.crearTokenAcceso(usuario, usuarioBase.correo, HttpStatus.OK);
        
        usuarioBase.tokenApi = tokenNuevo.token;

        await this._usuarioRepository.actualizarTokenUsuario(usuarioBase);

        return tokenNuevo;
    }
    
    async salir(correo:string): Promise<RespuestaGenerica> {
        const usuarioEntidad:UsuarioEntidad = await this._usuarioRepository.validarExistenciaCorreo(correo);
        
        usuarioEntidad.tokenApi = '';

        this._usuarioRepository.actualizarTokenUsuario(usuarioEntidad);

        return RespuestaUtil.respuestaGenerica('El usuario salió exitosamente del aplicativo',[], HttpStatus.OK);
    }

    
}
