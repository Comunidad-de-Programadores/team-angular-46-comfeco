import { HttpService, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

import { Status, AccountType, GoogleLoginDto } from '@comfeco/interfaces';

import { environment } from '../../../environments/environment';
import { UserRepository } from '../../inner/user/user.repository';
import { VerifyGoogle } from './verify.model';
import { UserEntity } from '../../inner/user/model/user.entity';
import { ParametersExcepcion } from '../../../util';
import { BasicService } from '../basic/basic.service';
import { TokenResponseDto } from '../tokensResponse';

@Injectable()
export class GoogleService {

    constructor(
        private readonly _httpService: HttpService,
        private readonly _basicService: BasicService,
        private readonly _userRepository: UserRepository
    ){}
    
    async login(googleDto:GoogleLoginDto): Promise<TokenResponseDto> {
        if (!googleDto || !googleDto.id) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['No se logro iniciar sesión con su cuenta de google'] });
        }
        
        const { email, id, idToken } = googleDto;

        const verify:VerifyGoogle = await this.verify(idToken);
        if(!verify.data.sub || verify.data.sub!==id || verify.data.email!==email) {
            throw new UnauthorizedException();
        }

        return await this.createToken(googleDto, verify.data.picture);
    }

    async createToken(googleDto:GoogleLoginDto, photoUrl:string): Promise<TokenResponseDto> {
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
                user,
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
        const baseUser:UserEntity = await this._userRepository.userExists(account.user);

        if(createToken) {
            return await this._basicService.updateAndCreateToken(baseUser, AccountType.GOOGLE);
        } else {
            throw new ParametersExcepcion({ code: HttpStatus.UNAUTHORIZED, errors: ['El usuario se encuentra inactivo'] });
        }
    }

    verify(token:string): Promise<VerifyGoogle> {
        const url:string = environment.url_verify_google+token;

        return this._httpService.get(url).toPromise();
    }

}
