import { Rol } from '../enum/roles.enum';
import { GenericResponse } from './generic_response.dto';

export class UserDto extends GenericResponse {
    readonly name?:string;
    readonly lastname?:string;
    readonly lastname_m?:string;
    readonly user: string;
    readonly email: string;
    readonly roles: Rol[];
}