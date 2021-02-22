import { HttpService, HttpStatus, Injectable } from '@nestjs/common';

import { Status, GenericResponse, TokenDto, AccountType, FacebookLoginDto } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';
import { UserEntity } from '../../user/user.entity';
import { UserRepository } from '../../user/user.repository';
import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';
import { VerifyFacebook } from './verify.model';

@Injectable()
export class FacebookService {

    constructor(
        private readonly _httpService: HttpService,
        private readonly _authService: AuthService,
        private readonly _configService: ConfigService,
        private readonly _userRepository: UserRepository
    ){}
    
    async login(facebookDto:FacebookLoginDto): Promise<TokenDto | GenericResponse> {
        if (!facebookDto) {
            return UtilResponse.genericResponse('',['No se logro iniciar sesión con su cuenta de facebook'], HttpStatus.BAD_REQUEST);
        }

        const { id , authToken } = facebookDto;
        
        const verify:VerifyFacebook = await this.verify(authToken);
        if(!verify.data.data || !verify.data.data.is_valid || verify.data.data.user_id!==id) {
            return UtilResponse.genericResponse('',['Credenciales incorrectas'], HttpStatus.BAD_REQUEST);
        }

        const photoUrl:any = await this.getProfilePicture(id);
        
        return await this.createToken(facebookDto, verify, photoUrl.data.picture.data.url);
    }

    async createToken(facebookDto:FacebookLoginDto, resp:VerifyFacebook, photoUrl:string): Promise<TokenDto | GenericResponse> {
        const { firstName:name, lastName:lastname, email, id , authToken } = facebookDto;

        if(!resp.data.data.is_valid) {
            return UtilResponse.genericResponse('',['Credenciales incorrectas'], HttpStatus.UNAUTHORIZED);
        }

        let user = email.substring(0, email.indexOf('@'));

        let account:UserEntity = {
            type: [ AccountType.FACEBOOK ],
            name,
            lastname,
            email,
            facebook: {
                id,
                authToken,
                photoUrl
            },
            user
        };

        const baseEmail:UserEntity = await this._userRepository.emailExists(email);
        let createToken:boolean = true;

        if(baseEmail!==null) {
            const type:AccountType[] = [...new Set([...baseEmail.type, AccountType.FACEBOOK])];
            user = baseEmail.user;

            account = {
                ...baseEmail,
                type,
                facebook: {
                    id,
                    authToken,
                    photoUrl
                }
            };

            if(baseEmail.status!==Status.ACTIVE) {
                createToken = false;
            }
        }

        await this._userRepository.registerUserSocialNetwork(account);
        
        if(createToken) {
            return this._authService.createAccessToken(user, email, AccountType.FACEBOOK, HttpStatus.OK);
        } else {
            return UtilResponse.genericResponse('',['El usuario se encuentra inactivo'], HttpStatus.UNAUTHORIZED);
        }
    }

    verify(token:string): Promise<VerifyFacebook> {
        const accessToken:string = this._configService.get( Configuration.FACEBOOK_TOKEN );
        const url:string = environment.url_verify_facebook
                .replace(':auth_token', token)
                .replace(':access_token', accessToken);

        return this._httpService.get(url).toPromise();
    }

    getProfilePicture(id:string): Promise<any> {
        const accessToken:string = this._configService.get( Configuration.FACEBOOK_TOKEN );
        const url:string = environment.url_picture_facebook
                .replace(':user_id', id)
                .replace(':access_token', accessToken);

        return this._httpService.get(url).toPromise();
    }
    
}
