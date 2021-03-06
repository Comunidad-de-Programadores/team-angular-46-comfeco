import { HttpStatus, Injectable } from '@nestjs/common';

import { ExhibitorDto, ExhibitorsDto, GenericResponse } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { ExhibitorsRepository } from './exhibitors.repository';

@Injectable()
export class ExhibitorsService {

    constructor(private readonly _exhibitorsRepository: ExhibitorsRepository) {}

    async exhibitors(): Promise<ExhibitorsDto | GenericResponse> {
        const exhibitorsEntity:ExhibitorDto[] = await this._exhibitorsRepository.exhibitors();
        
        if(exhibitorsEntity==null) {
            return UtilResponse.genericResponse('',['No hay información de los expositores en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        const exhibitors:ExhibitorsDto = {
            code: HttpStatus.OK,
            exhibitors: exhibitorsEntity
        }

        return exhibitors;
    }

}
