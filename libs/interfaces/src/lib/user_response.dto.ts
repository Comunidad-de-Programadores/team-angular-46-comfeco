import { Gender } from '../enum/gender.enum';
import { Rol } from '../enum/roles.enum';
import { GenericResponse } from './generic_response.dto';
import { KnowledgeAreaDto } from './knowledge_area_response.dto';
import { UserSocialNetworksDto } from './user_social_networks_response.dto';

export class UserDto extends GenericResponse {
    readonly user: string;
    readonly email: string;
    readonly roles: Rol[];
    readonly photoUrl?: string;
    readonly description?: string;
    readonly specialty?: KnowledgeAreaDto;
    readonly social_networks?: UserSocialNetworksDto;
    readonly gender?: Gender;
}