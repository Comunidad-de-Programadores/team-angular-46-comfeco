import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from "express";
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

import { Status, GenericResponse, TokenDto, AccountType } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { UserEntity } from '../../user/user.entity';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class FacebookService {

    constructor(
        private _httpService: HttpService,
        private _authService: AuthService,
        private _userRepository: UserRepository
    ){}
    
    async login(req: Request): Promise<TokenDto | GenericResponse> {
        if (!req.user) {
            return UtilResponse.genericResponse('',['No se logro iniciar sesión con su cuenta de facebook'], HttpStatus.BAD_REQUEST);
        }

        const userFacebook:any = req.user;
        const { firstName:name, lastName:lastname, email, id:idFacebook , accessToken:tokenFaceook } = userFacebook;
        const user = email.substring(0, email.indexOf('@'));

        const account:UserEntity = {
            type: AccountType.FACEBOOK,
            name,
            lastname,
            email,
            idFacebook,
            tokenFaceook,
            user
        };

        const userExists:UserEntity = await this._userRepository.userExists(user);
        let createToken:boolean = false;

        if(userExists!==null) {
            if(userExists.status===Status.ACTIVE) {
                createToken = true;
            } else {
                this.logout(idFacebook, tokenFaceook);
            }
        } else {
            createToken = true;
        }
        
        await this._userRepository.registerUserSocialNetwork(account);
        
        if(createToken) {
            return this._authService.createAccessToken(user, email, HttpStatus.OK);
        } else {
            return UtilResponse.genericResponse('',['El usuario se encuentra inactivo'], HttpStatus.UNAUTHORIZED);
        }
    }

    logout(userid:string, token:string): Observable<GenericResponse> {
        const headersRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
        
        const url:string = environment.url_logout_facebook.replace(':userid', userid);
        const response$:Observable<AxiosResponse> = this._httpService.delete(url, { headers: headersRequest });
        
        return response$
            .pipe(
                map(resp => {
                    let responseFacebook:GenericResponse;

                    if(resp.status==HttpStatus.OK) {
                        responseFacebook = {
                            code: resp.status,
                            message: 'Sesión cerrada con éxito'
                        }
                    } else {
                        responseFacebook = {
                            code: resp.status,
                            errors: [ 'La sesión no se pudo cerrar' ]
                        }
                    }
                    
                    return responseFacebook;
                })
            );
    }
    
}
