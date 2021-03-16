import { GenericResponse, TechnologieDto, TechnologiesDto } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';
import { HttpStatus, Injectable } from '@nestjs/common';
import { TechnologiesRepository } from './technologies.repository';

@Injectable()
export class TechnologiesService {

    constructor(private readonly _technologiesRepository: TechnologiesRepository) {}

     
    async technologies(): Promise<TechnologiesDto | GenericResponse> {
        const technologiesEntity:TechnologieDto[] = await this._technologiesRepository.technologies();
        
        if(technologiesEntity==null) {
            return UtilResponse.genericResponse('',['No hay lenguajes programados a usar durante el evento'], HttpStatus.NOT_FOUND);
        }
        
        const technologies:TechnologiesDto = {
            code: HttpStatus.OK,
            technologies: technologiesEntity
        }

        return technologies;
    }

}
