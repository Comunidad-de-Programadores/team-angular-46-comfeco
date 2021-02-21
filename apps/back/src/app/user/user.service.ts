import { AccountType, GenericResponse, UserDto } from '@comfeco/interfaces';
import { HttpStatus, Injectable } from '@nestjs/common';

import { UtilResponse, ValidatorService } from '@comfeco/validator';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { JwtUtil } from '../../util/jwt/jwt.util';

@Injectable()
export class UserService {
    
    constructor(
        private _jwtUtil: JwtUtil,
        private _userRepository: UserRepository
    ){}

    async information(user:string, token:string): Promise<UserDto | GenericResponse> {
        let validation:GenericResponse;
        
        validation = ValidatorService.user(user, validation);
        if(validation!=null) return validation;
        
        const userEntity:UserEntity = await this._userRepository.userExists(user);

        if(userEntity==null) {
            return UtilResponse.genericResponse('',['El usuario no tiene información en la base de datos'], HttpStatus.BAD_REQUEST);
        }

        const type:AccountType = this._jwtUtil.accessType(token);

        const { name, lastname, email, roles } = userEntity;

        const photoUrl:string = type===AccountType.EMAIL
                                            ? userEntity.photoUrl
                                            : AccountType.FACEBOOK
                                            ? userEntity.facebook.photoUrl
                                            : userEntity.google.photoUrl;

        const userInformation:UserDto = {
            code: HttpStatus.OK,
            name,
            lastname,
            user,
            email,
            roles,
            photoUrl
        };
        
        return userInformation;
    }
    
}
