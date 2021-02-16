import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { Estatus, TipoCuenta, RespuestaGenerica, RegistroDto, TokenDto, InicioDto, RecuperarCuentaDto, CambioContraseniaDto, ExpresionRegex } from '@comfeco/interfaces';
import { RespuestaUtil, ValidarServicio } from '@comfeco/validator';

import { AuthService } from '../auth.service';
import { CorreoService } from '../../../config/correo/correo.service';
import { FacebookService } from '../facebook/facebook.service';
import { GoogleService } from '../google/google.service';
import { UsuarioEntidad } from './../../usuario/usuario.entity';
import { UsuarioRepository } from './../../usuario/usuario.repository';
import { ConfigService } from '../../../config/config.service';
import { Configuracion } from '../../../config/config.keys';

@Injectable()
export class BasicoService {
    private readonly logger = new Logger(BasicoService.name);

    constructor(
        private _configService: ConfigService,
        private _usuarioRepository: UsuarioRepository,
        private _googleService: GoogleService,
        private _facebookService: FacebookService,
        private _authService: AuthService,
        private _correoService: CorreoService
    ) {}
    
    async registro(registroDto:RegistroDto): Promise<TokenDto | RespuestaGenerica> {
        const { usuario, correo, contrasenia, terminos } = registroDto;
        let validacion:RespuestaGenerica;
        
        if(!terminos) {
            return RespuestaUtil.respuestaGenerica('',['Es necesario aceptar las políticas de privacidad, así como los términos y condiciones'], HttpStatus.BAD_REQUEST);
        }

        validacion = ValidarServicio.usuario(usuario, validacion);
        validacion = ValidarServicio.correo(correo, validacion);
        validacion = ValidarServicio.contrasenia(contrasenia, validacion);
        if(validacion!=null) return validacion;

        let mensajeError:string;
        let usuarioBase:UsuarioEntidad = await this._usuarioRepository.validarExistenciaUsuario(usuario);

        if(usuarioBase!=null) {
            mensajeError = 'El usuario ya se encuentra registrado';
        } else {
            usuarioBase = await this._usuarioRepository.validarExistenciaTipoCorreo(correo);

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
        let validacion:RespuestaGenerica;
        
        if(!usuario && !correo) {
            return RespuestaUtil.respuestaGenerica('',['Es necesario enviar el usuario o el correo para poder validar las credenciales'], HttpStatus.UNAUTHORIZED);
        }
        
        if(correo) {
            validacion = ValidarServicio.correo(correo, validacion);
        }

        validacion = ValidarServicio.contrasenia(contrasenia, validacion);
        if(validacion!=null) return validacion;

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
            usuarioEntidad = await this._usuarioRepository.validarExistenciaTipoCorreo(correo);
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
        let validacion:RespuestaGenerica;
        
        validacion = ValidarServicio.usuario(usuario, validacion);
        validacion = ValidarServicio.token(token, validacion);
        if(validacion!=null) return validacion;

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
        let validacion:RespuestaGenerica;
        
        let usuarioBase:UsuarioEntidad;

        if(usuario) {
            validacion = ValidarServicio.usuario(usuario, validacion);
            if(validacion!=null) return validacion;
            
            usuarioBase = await this._usuarioRepository.validarExistenciaUsuario(usuario);
        } else {
            validacion = ValidarServicio.correo(correo, validacion);
            if(validacion!=null) return validacion;
            
            usuarioBase = await this._usuarioRepository.validarExistenciaTipoCorreo(correo);
        }
        
        if(usuarioBase!==null) {
            const nuevoToken = jwt.sign({id:Math.floor(Math.random()*100)}, this._configService.get(Configuracion.JWT_SECRETO), {
                algorithm: "HS256",
                expiresIn: this._configService.get(Configuracion.JWT_TIEMPO_EXPIRACION_CORREO),
            });

            usuarioBase.tokenApi=nuevoToken;
            await this._usuarioRepository.actualizarTokenUsuario(usuarioBase);

            try {
                await this._correoService.recuperarCuenta(usuarioBase);
            } catch(err) {
                return RespuestaUtil.respuestaGenerica('',['No es posible enviar el correo electrónico, favor de intentar más tarde'], HttpStatus.BAD_REQUEST);    
            }
        }

        if(!usuarioBase) {
            return RespuestaUtil.respuestaGenerica('',['No existe una cuenta con los datos proporcionados'], HttpStatus.BAD_REQUEST);
        } else {
            return RespuestaUtil.respuestaGenerica('Se envió un correo electrónico para recuperar su cuenta. Revisar en la carpeta de correos no deseados',[], HttpStatus.OK);
        }
    }

    async cambioContrasenia(cambioContrasenia:CambioContraseniaDto): Promise<RespuestaGenerica> {
        const { contrasenia, token } = cambioContrasenia;
        let validacion:RespuestaGenerica;
        let tokenCaducado:boolean = false;

        validacion = ValidarServicio.contrasenia(contrasenia, validacion);
        validacion = ValidarServicio.token(token, validacion);
        if(validacion!=null) return validacion;

        try {
            jwt.verify(token, this._configService.get(Configuracion.JWT_SECRETO));
        } catch(err) {
            this.logger.debug(err.message);
            tokenCaducado = true;
        }

        if(!contrasenia || !ExpresionRegex.PASSWORD.test(contrasenia) || tokenCaducado) {
            return RespuestaUtil.respuestaGenerica('',['No es posible modificar la contraseña de la cuenta'], HttpStatus.BAD_REQUEST);
        }

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
        let validacion:RespuestaGenerica;

        validacion = ValidarServicio.correo(correo, validacion);
        if(validacion!=null) return validacion;

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
