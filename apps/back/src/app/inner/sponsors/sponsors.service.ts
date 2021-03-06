import { HttpStatus, Injectable } from '@nestjs/common';

import { GenericResponse, SponsorDto, SponsorsDto } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { SponsorsRepository } from './sponsors.repository';

@Injectable()
export class SponsorsService {

    constructor(private readonly _sponsorsRepository: SponsorsRepository) {}

    async sponsors(): Promise<SponsorsDto | GenericResponse> {
        const sponsorsEntity:SponsorDto[] = await this._sponsorsRepository.sponsors();
        
        if(sponsorsEntity==null) {
            return UtilResponse.genericResponse('',['No hay información de los patrocinadores en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        const sponsors:SponsorsDto = {
            code: HttpStatus.OK,
            sponsors: sponsorsEntity
        }

        return sponsors;
    }

}
