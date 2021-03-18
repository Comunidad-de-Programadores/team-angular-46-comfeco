import { HttpService, HttpStatus, Injectable } from '@nestjs/common';

import { GenericResponse } from '@comfeco/interfaces';

import { environment } from '../../../environments/environment';
import { UserEntity } from '../../inner/user/model/user.entity';
import { ParametersExcepcion } from '../../../util';
import { AxiosResponse } from 'axios';

@Injectable()
export class FacebookLogoutService {

    constructor(
        private readonly _httpService: HttpService,
    ){}
    
    async logout(baseUser:UserEntity): Promise<GenericResponse> {
        if(baseUser===null || baseUser.facebook===null || baseUser.facebook.authToken===null || baseUser.facebook.id===null) {
            throw new ParametersExcepcion({ code: HttpStatus.BAD_REQUEST, errors: ['Tu cuenta de facebook no se encuentra iniciada'] });
        }

        const { id, authToken } = baseUser.facebook;
        const userid:string = id;
        const token:string = authToken;

        const headersRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
        
        const url:string = environment.url_logout_facebook.replace(':userid', userid);
        const response:AxiosResponse = await this._httpService.delete(url, { headers: headersRequest }).toPromise();
        
        let responseFacebook:GenericResponse;

        if(response.status==HttpStatus.OK) {
            responseFacebook = {
                code: response.status,
                message: 'Sesión cerrada con éxito'
            }
        } else {
            responseFacebook = {
                code: response.status,
                errors: [ 'La sesión no se pudo cerrar' ]
            }
        }

        return responseFacebook;
    }
    
}
