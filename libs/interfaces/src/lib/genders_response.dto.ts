import { GenderDto } from './gender_response.dto';
import { GenericResponse } from './generic_response.dto';

export class GendersDto extends GenericResponse {
    readonly genders: GenderDto[];
}