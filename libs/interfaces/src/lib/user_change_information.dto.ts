import { CountryDto } from "./country_response.dto";
import { UserSocialNetworksDto } from "./user_social_networks_response.dto";

export class UserChangeInformationDto {
    readonly user?: string;
    readonly email?: string;
    readonly gender?: string;
    readonly birdth_date?: Date;
    readonly country?: CountryDto;
    readonly password: string;
    readonly password_new?: string;
    readonly description?: string;
    readonly specialities?: string[];
    readonly social_networks?: UserSocialNetworksDto;
}