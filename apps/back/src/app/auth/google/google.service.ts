import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from "express";
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Estatus, TipoCuenta, RespuestaGenerica, TokenDto } from '@comfeco/interfaces';

import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { UsuarioEntidad } from '../../usuario/usuario.entity';
import { UsuarioRepository } from '../../usuario//usuario.repository';
import { RespuestaUtil } from '../../../util/general/respuestas.util';

@Injectable()
export class GoogleService {

    constructor(
        private _httpService: HttpService,
        private _authService: AuthService,
        private _usuarioRepository: UsuarioRepository
    ){}
    
    async ingresar(req:Request): Promise<TokenDto | RespuestaGenerica> {
        if (!req.user) {
            return RespuestaUtil.respuestaGenerica('',['No se logro iniciar sesión con su cuenta de google'], HttpStatus.BAD_REQUEST);
        }

        const usuarioGoogle:any = req.user;
        const { firstName:nombre, lastName:apellido_paterno, email:correo, accessToken:tokenGoogle } = usuarioGoogle;
        const usuario = correo.substring(0, correo.indexOf('@'));

        const cuenta:UsuarioEntidad = {
            tipo: TipoCuenta.GOOGLE,
            nombre,
            apellido_paterno,
            correo,
            tokenGoogle,
            usuario
        };

        const usuarioExiste:UsuarioEntidad = await this._usuarioRepository.validarExistenciaUsuario(usuario);
        let crearToken:boolean = false;

        if(usuarioExiste!==null) {
            if(usuarioExiste.estatus===Estatus.ACTIVO) {
                crearToken = true;
            } else {
                this.salir(tokenGoogle);
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

    salir(token:string): Observable<RespuestaGenerica> {
        const url:string = environment.url_logout_google+token;
        const respuesta$:Observable<AxiosResponse> = this._httpService.post(url);
        
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
