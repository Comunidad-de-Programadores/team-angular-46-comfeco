import { CountryDto } from './country_response.dto';
import { GenericResponse } from './generic_response.dto';

export class CountrysDto extends GenericResponse {
    readonly country: CountryDto[];
}