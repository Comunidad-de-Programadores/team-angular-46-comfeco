import { HttpStatus, Injectable } from '@nestjs/common';

import { GenderDto, GendersDto, GenericResponse } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { GenderRepository } from './gender.repository';

@Injectable()
export class GenderService {

    constructor(private readonly _genderRepository: GenderRepository) {}

    async genders(): Promise<GendersDto | GenericResponse> {
        const sponsorsEntity:GenderDto[] = await this._genderRepository.genders();
        
        if(sponsorsEntity==null) {
            return UtilResponse.genericResponse('',['No hay información de generos en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        const genders:GendersDto = {
            code: HttpStatus.OK,
            genders: sponsorsEntity
        }

        return genders;
    }

}
