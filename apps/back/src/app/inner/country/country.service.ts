import { HttpService, HttpStatus, Injectable } from '@nestjs/common';

import { CountryDto, CountrysDto, GenericResponse } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { environment } from '../../../environments/environment';

@Injectable()
export class CountryService {

    constructor(private readonly _httpService: HttpService) {}

    async countrys(): Promise<CountrysDto | GenericResponse> {
        const url:string = environment.url_service_countrys;
        const countrysEntity:any = await this._httpService.get(url).toPromise();
        
        if(countrysEntity==null) {
            return UtilResponse.genericResponse('',['No se puede obtener la información de los países'], HttpStatus.NOT_FOUND);
        }
        
        let country: CountryDto[] = [];

        countrysEntity.data.forEach((countryResp:any) => {
            country.push({
                flag: countryResp.flag,
                name: countryResp.name,
            });
        });

        const countrys:CountrysDto = {
            code: HttpStatus.OK,
            country
        }

        return countrys;
    }

}
