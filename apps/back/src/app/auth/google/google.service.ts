import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from "express";
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Status, AccountType, GenericResponse, TokenDto } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { UserEntity } from '../../user/user.entity';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class GoogleService {

    constructor(
        private _httpService: HttpService,
        private _authService: AuthService,
        private _userRepository: UserRepository
    ){}
    
    async login(req:Request): Promise<TokenDto | GenericResponse> {
        if (!req.user) {
            return UtilResponse.genericResponse('',['No se logro iniciar sesión con su cuenta de google'], HttpStatus.BAD_REQUEST);
        }

        const userGoogle:any = req.user;
        const { firstName:name, lastName:lastname, email, accessToken:tokenGoogle } = userGoogle;
        const user = email.substring(0, email.indexOf('@'));

        const account:UserEntity = {
            type: AccountType.GOOGLE,
            name,
            lastname,
            email,
            tokenGoogle,
            user
        };

        const userExists:UserEntity = await this._userRepository.userExists(user);
        let createToken:boolean = false;

        if(userExists!==null) {
            if(userExists.status===Status.ACTIVE) {
                createToken = true;
            } else {
                this.logout(tokenGoogle);
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

    logout(token:string): Observable<GenericResponse> {
        const url:string = environment.url_logout_google+token;
        const response$:Observable<AxiosResponse> = this._httpService.post(url);
        
        return response$
            .pipe(
                map(resp => {
                    let responseGoogle:GenericResponse;

                    if(resp.status==HttpStatus.OK) {
                        responseGoogle = {
                            code: resp.status,
                            message: 'Sesión cerrada con éxito'
                        }
                    } else {
                        responseGoogle = {
                            code: resp.status,
                            errors: [ 'La sesión no se pudo cerrar' ]
                        }
                    }
                    
                    return responseGoogle;
                })
            );
    }
    
}
