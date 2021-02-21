import { HttpService, HttpStatus, Injectable } from '@nestjs/common';

import { Status, AccountType, GenericResponse, TokenDto, GoogleLoginDto } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { UserEntity } from '../../user/user.entity';
import { UserRepository } from '../../user/user.repository';
import { VerifyGoogle } from './verify.model';

@Injectable()
export class GoogleService {

    constructor(
        private _httpService: HttpService,
        private _authService: AuthService,
        private _userRepository: UserRepository
    ){}
    
    async login(googleDto:GoogleLoginDto): Promise<TokenDto | GenericResponse> {
        if (!googleDto) {
            return UtilResponse.genericResponse('',['No se logro iniciar sesión con su cuenta de google'], HttpStatus.BAD_REQUEST);
        }

        const { email, id, idToken } = googleDto;

        const verify:VerifyGoogle = await this.verify(idToken);
        if(!verify.data.sub || verify.data.sub!==id || verify.data.email!==email) {
            return UtilResponse.genericResponse('',['Credenciales incorrectas'], HttpStatus.BAD_REQUEST);
        }

        return await this.createToken(googleDto, verify.data.picture);
    }

    async createToken(googleDto:GoogleLoginDto, photoUrl:string) {
        const { firstName:name, lastName:lastname, email, authToken, idToken } = googleDto;
        
        let user = email.substring(0, email.indexOf('@'));

        let account:UserEntity = {
            type: [ AccountType.GOOGLE ],
            name,
            lastname,
            email,
            photoUrl,
            google: {
                authToken,
                idToken,
                photoUrl
            },
            user
        };

        const baseEmail:UserEntity = await this._userRepository.emailExists(email);
        let createToken:boolean = true;
        
        if(baseEmail!==null) {
            const type:AccountType[] = [...new Set([...baseEmail.type, AccountType.GOOGLE])];
            user = baseEmail.user;

            account = {
                ...baseEmail,
                type,
                google: {
                    authToken,
                    idToken,
                    photoUrl
                },
            };
            
            if(baseEmail.status!==Status.ACTIVE) {
                createToken = false;
            }
        }

        await this._userRepository.registerUserSocialNetwork(account);
        
        if(createToken) {
            return this._authService.createAccessToken(user, email, AccountType.GOOGLE, HttpStatus.OK);
        } else {
            return UtilResponse.genericResponse('',['El usuario se encuentra inactivo'], HttpStatus.UNAUTHORIZED);
        }
    }

    verify(token:string): Promise<VerifyGoogle> {
        const url:string = environment.url_verify_google+token;

        return this._httpService.get(url).toPromise();
    }

}
