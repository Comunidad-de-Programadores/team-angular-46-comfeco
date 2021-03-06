import { HttpStatus, Injectable } from '@nestjs/common';

import { GenericResponse, InsigniaDto, InsigniasDto } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { InsigniaRepository } from './insignia.repository';

@Injectable()
export class InsigniaService {

    constructor(private readonly _insigniaRepository: InsigniaRepository) {}

     
    async insignias(): Promise<InsigniasDto | GenericResponse> {
        const insigniasEntity:InsigniaDto[] = await this._insigniaRepository.insignias();
        
        if(insigniasEntity==null) {
            return UtilResponse.genericResponse('',['No hay insignias registradas en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        const insignias:InsigniasDto = {
            code: HttpStatus.OK,
            insignias: insigniasEntity
        }

        return insignias;
    }

}
