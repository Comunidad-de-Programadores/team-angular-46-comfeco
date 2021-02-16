import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from "express";
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

import { Estatus, TipoCuenta, RespuestaGenerica, TokenDto } from '@comfeco/interfaces';
import { RespuestaUtil } from '@comfeco/validator';

import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { UsuarioEntidad } from '../../usuario/usuario.entity';
import { UsuarioRepository } from '../../usuario/usuario.repository';

@Injectable()
export class FacebookService {

    constructor(
        private _httpService: HttpService,
        private _authService: AuthService,
        private _usuarioRepository: UsuarioRepository
    ){}
    
    async ingresar(req: Request): Promise<TokenDto | RespuestaGenerica> {
        if (!req.user) {
            return RespuestaUtil.respuestaGenerica('',['No se logro iniciar sesión con su cuenta de facebook'], HttpStatus.BAD_REQUEST);
        }

        const usuarioFacebook:any = req.user;
        const { firstName:nombre, lastName:apellido_paterno, email:correo, id:idFacebook , accessToken:tokenFaceook } = usuarioFacebook;
        const usuario = correo.substring(0, correo.indexOf('@'));

        const cuenta:UsuarioEntidad = {
            tipo: TipoCuenta.FACEBOOK,
            nombre,
            apellido_paterno,
            correo,
            idFacebook,
            tokenFaceook,
            usuario
        };

        const usuarioExiste:UsuarioEntidad = await this._usuarioRepository.validarExistenciaUsuario(usuario);
        let crearToken:boolean = false;

        if(usuarioExiste!==null) {
            if(usuarioExiste.estatus===Estatus.ACTIVO) {
                crearToken = true;
            } else {
                this.salir(idFacebook, tokenFaceook);
            }
        } else {
            crearToken = true;
        }
        
        await this._usuarioRepository.registrarUsuarioRedSocial(cuenta);
        
        if(crearToken) {
            return this._authService.crearTokenAcceso(usuario, correo, HttpStatus.OK);
        } else {
            return RespuestaUtil.respuestaGenerica('',['El usuario se encuentra inactivo'], HttpStatus.UNAUTHORIZED);
        }
    }

    salir(userid:string, token:string): Observable<RespuestaGenerica> {
        const headersRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
        console.log(`cerrando sesion con facebook ${userid} token: ${token}`);
        const url:string = environment.url_logout_facebook.replace(':userid', userid);
        const respuesta$:Observable<AxiosResponse> = this._httpService.delete(url, { headers: headersRequest });
        
        return respuesta$
            .pipe(
                map(resp => {
                    let resultadoGoogle:RespuestaGenerica;

                    if(resp.status==HttpStatus.OK) {
                        resultadoGoogle = {
                            codigo: resp.status,
                            mensaje: 'Sesión cerrada con éxito'
                        }
                    } else {
                        resultadoGoogle = {
                            codigo: resp.status,
                            errores: [ 'La sesión no se pudo cerrar' ]
                        }
                    }
                    
                    return resultadoGoogle;
                })
            );
    }
    
}
