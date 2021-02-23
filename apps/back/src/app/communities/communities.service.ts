import { HttpStatus, Injectable } from '@nestjs/common';

import { CommunitiesDto, CommunityDto, GenericResponse } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { CommunitiesRepository } from './communities.repository';

@Injectable()
export class CommunitiesService {

    constructor(private readonly _communitiesRepository: CommunitiesRepository) {}

    async communitiesFirstThree(): Promise<CommunitiesDto | GenericResponse> {
        const communitiesEntity:CommunityDto[] = await this._communitiesRepository.communitiesFirstThree();
        
        return this._collectionFiltering(communitiesEntity);
    }
    
    async communitiesAll(): Promise<CommunitiesDto | GenericResponse> {
        const communitiesEntity:CommunityDto[] = await this._communitiesRepository.communitiesAll();
        
        return this._collectionFiltering(communitiesEntity);
    }

    private async _collectionFiltering(communitiesEntity:CommunityDto[]) {
        if(communitiesEntity==null) {
            return UtilResponse.genericResponse('',['No hay información de las comunidades en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        const communities:CommunitiesDto = {
            code: HttpStatus.OK,
            communities: communitiesEntity
        }

        return communities;
    }
    
}
