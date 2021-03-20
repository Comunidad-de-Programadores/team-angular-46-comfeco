import { GenericResponse, GroupDto, GroupsDto } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GroupsRepository } from './groups.repository';

@Injectable()
export class GroupsService {

    constructor(private readonly _groupsRepository: GroupsRepository) {}

     
    async groups(idUser:string): Promise<GroupsDto | GenericResponse> {
        const groupsEntity:GroupDto[] = await this._groupsRepository.groups(idUser);
        
        if(groupsEntity==null) {
            return UtilResponse.genericResponse('',['No hay grupos activos en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        return this._filterGroup(groupsEntity);
    }

    async groupNameAndLanguage(idUser:string, name:string, languageId:string) {
        if(!!name && languageId==='-1') {
            return this.groupContainsName(idUser, name);
        }
        
        if(!name) {
            return this.groupByLanguage(idUser, languageId);
        }

        const nameGroup:string = name.toLowerCase();

        const groupsEntity:GroupDto[] = await this._groupsRepository.groupNameAndLanguage(idUser, nameGroup, languageId);
        
        if(groupsEntity==null) {
            return UtilResponse.genericResponse('',['No hay coincidencias con ese nombre de grupo y lenguaje'], HttpStatus.NOT_FOUND);
        }
        
        return this._filterGroup(groupsEntity);
    }

    async groupContainsName(idUser:string, name:string) {
        if(!name) {
            return UtilResponse.genericResponse('',['Es necesario enviar un nombre para poder realizar la busqueda'], HttpStatus.NOT_FOUND);
        }

        const nameGroup:string = name.toLowerCase();

        const groupsEntity:GroupDto[] = await this._groupsRepository.groupContainsName(idUser, nameGroup);
        
        if(groupsEntity==null) {
            return UtilResponse.genericResponse('',['No hay coincidencias con ese nombre de grupo'], HttpStatus.NOT_FOUND);
        }
        
        return this._filterGroup(groupsEntity);
    }

    async groupByLanguage(idUser:string, languageId:string) {
        if(languageId==='-1') {
            return this.groups(idUser);
        }
        
        if(!languageId) {
            return UtilResponse.genericResponse('',['Es necesario enviar el id para mostrar la información del grupo'], HttpStatus.NOT_FOUND);
        }

        const groupsEntity:GroupDto[] = await this._groupsRepository.groupByLanguage(idUser, languageId);
        
        if(groupsEntity==null) {
            return UtilResponse.genericResponse('',['No hay coincidencias con ese id de grupo'], HttpStatus.NOT_FOUND);
        }
        
        return this._filterGroup(groupsEntity);
    }

    private _filterGroup(groupsEntity:GroupDto[]) {
        const groupsInformation:GroupDto[] = [];

        groupsEntity.forEach((group:GroupDto) => {
            const { id, name:groupName, language, penality, description, belong } = group;
            groupsInformation.push({ id, name:groupName, language, penality, description, belong });
        });

        const groups:GroupsDto = {
            code: HttpStatus.OK,
            groups: groupsInformation
        }

        return groups;
    }

}
