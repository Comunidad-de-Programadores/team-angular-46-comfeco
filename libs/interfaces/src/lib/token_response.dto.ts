import { GenericResponse } from './generic_response.dto';

export class TokenDto extends GenericResponse {
    readonly token: string;
    readonly user: string;
}