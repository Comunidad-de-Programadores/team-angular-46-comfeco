import { Gender } from '../enum/gender.enum';
import { Rol } from '../enum/roles.enum';
import { CountryDto } from './country_response.dto';
import { GenericResponse } from './generic_response.dto';
import { InsigniaDto } from './insignia_response.dto';
import { KnowledgeAreaDto } from './knowledge_area_response.dto';
import { UserSocialNetworksDto } from './user_social_networks_response.dto';

export class UserDto extends GenericResponse {
    readonly user: string;
    readonly email: string;
    readonly roles: Rol[];
    readonly photoUrl?: string;
    readonly country?: CountryDto;
    readonly description?: string;
    readonly birdth_date?: Date;
    readonly specialities?: KnowledgeAreaDto[];
    readonly social_networks?: UserSocialNetworksDto;
    readonly gender?: Gender;
    readonly insignia?: InsigniaDto;
    readonly edit?:boolean;
}