import { HttpService, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

import { Status, AccountType, FacebookLoginDto } from '@comfeco/interfaces';

import { environment } from '../../../environments/environment';
import { UserRepository } from '../../inner/user/user.repository';
import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';
import { VerifyFacebook } from './verify.model';
import { UserEntity } from '../../inner/user/model/user.entity';
import { ParametersExcepcion } from '../../../util';
import { TokenResponseDto } from '../tokensResponse';
import { BasicService } from '../basic/basic.service';

@Injectable()
export class FacebookService {

    constructor(
        private readonly _httpService: HttpService,
        private readonly _configService: ConfigService,
        private readonly _basicService: BasicService,
        private readonly _userRepository: UserRepository
    ){}
    
    async login(facebookDto:FacebookLoginDto): Promise<TokenResponseDto> {
        if (!facebookDto || !facebookDto.id) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['No se logro iniciar sesión con su cuenta de facebook'] });
        }

        const { id , authToken } = facebookDto;
        
        const verify:VerifyFacebook = await this.verify(authToken);
        if(!verify.data.data || !verify.data.data.is_valid || verify.data.data.user_id!==id) {
            throw new UnauthorizedException();
        }

        const photoUrl:any = await this.getProfilePicture(id);
        
        return await this.createToken(facebookDto, verify, photoUrl.data.picture.data.url);
    }

    async createToken(facebookDto:FacebookLoginDto, resp:VerifyFacebook, photoUrl:string): Promise<TokenResponseDto> {
        const { firstName:name, lastName:lastname, email, id , authToken } = facebookDto;

        if(!resp.data.data.is_valid) {
            throw new UnauthorizedException();
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
                user,
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
        const baseUser:UserEntity = await this._userRepository.userExists(account.user);

        if(createToken) {
            return await this._basicService.updateAndCreateToken(baseUser, AccountType.FACEBOOK);
        } else {
            throw new ParametersExcepcion({ code: HttpStatus.UNAUTHORIZED, errors: ['El usuario se encuentra inactivo'] });
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
