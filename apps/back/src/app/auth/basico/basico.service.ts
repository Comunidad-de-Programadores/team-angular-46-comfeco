import { Injectable, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import crypto from 'crypto';

import { Estatus, TipoCuenta, RespuestaGenerica, RegistroDto, TokenDto, InicioDto, RecuperarCuentaDto, CambioContraseniaDto } from '@comfeco/interfaces';

import { AuthService } from '../auth.service';
import { CorreoService } from '../../../config/correo/correo.service';
import { FacebookService } from '../facebook/facebook.service';
import { GoogleService } from '../google/google.service';
import { UsuarioEntidad } from './../../usuario/usuario.entity';
import { UsuarioRepository } from './../../usuario/usuario.repository';
import { RespuestaUtil } from '../../../util/general/respuestas.util';

@Injectable()
export class BasicoService {

    constructor(
        private _usuarioRepository: UsuarioRepository,
        private _googleService: GoogleService,
        private _facebookService: FacebookService,
        private _authService: AuthService,
        private _correoService: CorreoService
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
    
    async recuperarCuenta(recuperarContraseniaDto:RecuperarCuentaDto): Promise<RespuestaGenerica> {
        const { usuario, correo } = recuperarContraseniaDto;

        let usuarioBase:UsuarioEntidad;

        if(usuario) {
            usuarioBase = await this._usuarioRepository.validarExistenciaUsuario(usuario);
        } else {
            usuarioBase = await this._usuarioRepository.validarExistenciaCorreo(correo);
        }

        if(usuarioBase && usuarioBase.tipo==TipoCuenta.CORREO) {
            const nuevoToken = (
                longitud = 200,
                caracteresValidos = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$_.*%&()=[]+'
            ) =>
                Array.from(crypto.randomFillSync(new Uint32Array(longitud)))
                    .map((x) => caracteresValidos[x % caracteresValidos.length])
                    .join('');
            
            usuarioBase.tokenApi=nuevoToken();
            await this._usuarioRepository.actualizarTokenUsuario(usuarioBase);
            await this._correoService.recuperarCuenta(usuarioBase);
        }

        if(!usuarioBase || usuarioBase.tipo!=TipoCuenta.CORREO) {
            return RespuestaUtil.respuestaGenerica('',['No existe una cuenta con los datos proporcionados'], HttpStatus.BAD_REQUEST);
        } else {
            return RespuestaUtil.respuestaGenerica('Se envió un correo electrónico para recuperar su cuenta. Revisar en la carpeta de correos no deseados',[], HttpStatus.OK);
        }
    }

    async cambioContrasenia(cambioContrasenia:CambioContraseniaDto): Promise<RespuestaGenerica> {
        const { contrasenia, token } = cambioContrasenia;

        let usuarioBase:UsuarioEntidad;

        usuarioBase = await this._usuarioRepository.validarExistenciaTokenCambioContrasenia(token);

        if(!usuarioBase || usuarioBase.tipo!=TipoCuenta.CORREO) {
            return RespuestaUtil.respuestaGenerica('',['No es posible modificar la contraseña de la cuenta'], HttpStatus.BAD_REQUEST);
        } else {
            usuarioBase.contrasenia = await bcrypt.hash(contrasenia, 10);
            usuarioBase.tokenApi = '';
            await this._usuarioRepository.actualizarTokenUsuario(usuarioBase);

            return RespuestaUtil.respuestaGenerica('Se cambio satisfactoriamente la contraseña de la cuenta',[], HttpStatus.ACCEPTED);
        }
    }

    async salir(correo:string): Promise<RespuestaGenerica> {
        const usuarioEntidad:UsuarioEntidad = await this._usuarioRepository.validarExistenciaCorreo(correo);
        let respuesta:RespuestaGenerica;

        if(usuarioEntidad.tipo==TipoCuenta.GOOGLE) {
            const salirGoogle$ = this._googleService.salir(usuarioEntidad.tokenGoogle);
            respuesta = this._respuestaSalirRedSocial(salirGoogle$);
        }

        if(usuarioEntidad.tipo==TipoCuenta.FACEBOOK) {
            const salirFacebook$ = this._facebookService.salir(usuarioEntidad.idFacebook, usuarioEntidad.tokenFaceook);respuesta = this._respuestaSalirRedSocial(salirFacebook$);
        }

        if(respuesta==undefined) {
            respuesta = await RespuestaUtil.respuestaGenerica('El usuario salió exitosamente del aplicativo',[], HttpStatus.OK);
        }

        usuarioEntidad.tokenApi = '';

        this._usuarioRepository.actualizarTokenUsuario(usuarioEntidad);

        return respuesta;
    }

    private _respuestaSalirRedSocial(observableServicio$:Observable<RespuestaGenerica>): RespuestaGenerica {
        let respuesta:RespuestaGenerica;
        const salirRespuesta = observableServicio$.subscribe(
            resp => respuesta = resp
        );
        
        salirRespuesta.unsubscribe();
        
        return respuesta;
    }
    
}
