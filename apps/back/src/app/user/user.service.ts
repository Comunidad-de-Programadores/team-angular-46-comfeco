import { GenericResponse, UserDto } from '@comfeco/interfaces';
import { HttpStatus, Injectable } from '@nestjs/common';

import { UtilResponse, ValidatorService } from '@comfeco/validator';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

    constructor(private _userRepository: UserRepository){}

    async information(user:string): Promise<UserDto | GenericResponse> {
        let validation:GenericResponse;
        
        validation = ValidatorService.user(user, validation);
        if(validation!=null) return validation;
        
        const userEntity:UserEntity = await this._userRepository.userExists(user);

        if(userEntity==null) {
            return UtilResponse.genericResponse('',['El usuario no tiene información en la base de datos'], HttpStatus.BAD_REQUEST);
        }

        const { name, lastname, lastname_m, email, roles } = userEntity;

        const userInformation:UserDto = {
            code: HttpStatus.OK,
            name,
            lastname,
            lastname_m,
            user,
            email,
            roles
        };
        
        return userInformation;
    }
    
}
