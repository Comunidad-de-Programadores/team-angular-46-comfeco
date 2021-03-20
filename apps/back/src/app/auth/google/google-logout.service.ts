import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import { GenericResponse } from '@comfeco/interfaces';

import { environment } from '../../../environments/environment';
import { UserEntity } from '../../inner/user/model/user.entity';
import { ParametersExcepcion } from '../../../util';

@Injectable()
export class GoogleLogoutService {

    constructor(
        private readonly _httpService: HttpService,
    ){}

    async logout(baseUser:UserEntity): Promise<GenericResponse> {
        if(baseUser===null || baseUser.google===null || baseUser.google.authToken===null) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['Tu cuenta de google no se encuentra iniciada'] });
        }

        const token:string = baseUser.google.authToken;
        const url:string = environment.url_logout_google+token;
        const response:AxiosResponse = await this._httpService.post(url).toPromise();
        
        let responseGoogle:GenericResponse;

        if(response.status==HttpStatus.OK) {
            responseGoogle = {
                code: response.status,
                message: 'Sesión cerrada con éxito'
            }
        } else {
            responseGoogle = {
                code: response.status,
                errors: [ 'La sesión no se pudo cerrar' ]
            }
        }
        
        return responseGoogle;
    }

}
