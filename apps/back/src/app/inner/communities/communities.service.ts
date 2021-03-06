import { HttpStatus, Injectable } from '@nestjs/common';

import { CommunitiesDto, CommunityDto } from '@comfeco/interfaces';

import { CommunitiesRepository } from './communities.repository';
import { ParametersExcepcion } from '../../../util';

@Injectable()
export class CommunitiesService {

    constructor(private readonly _communitiesRepository: CommunitiesRepository) {}

    async communitiesFirstThree(): Promise<CommunitiesDto> {
        const communitiesEntity:CommunityDto[] = await this._communitiesRepository.communitiesFirstThree();
        
        return this._collectionFiltering(communitiesEntity);
    }
    
    async communitiesAll(): Promise<CommunitiesDto> {
        const communitiesEntity:CommunityDto[] = await this._communitiesRepository.communitiesAll();
        
        return this._collectionFiltering(communitiesEntity);
    }

    private async _collectionFiltering(communitiesEntity:CommunityDto[]): Promise<CommunitiesDto> {
        if(communitiesEntity==null) {
            throw new ParametersExcepcion({ code: HttpStatus.UNAUTHORIZED, errors: ['No hay información de las comunidades en la base de datos'] });
        }
        
        const communities:CommunitiesDto = {
            code: HttpStatus.OK,
            communities: communitiesEntity
        }

        return communities;
    }
    
}
