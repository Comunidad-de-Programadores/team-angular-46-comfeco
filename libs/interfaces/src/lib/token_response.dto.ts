import { GenericResponse } from './generic_response.dto';

export class TokenDto extends GenericResponse {
    readonly user: string;
}