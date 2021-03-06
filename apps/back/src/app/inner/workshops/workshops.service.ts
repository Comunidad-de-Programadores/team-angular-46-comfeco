import { UtilResponse } from '@comfeco/validator';
import { HttpStatus, Injectable } from '@nestjs/common';

import { AreasDto, AreaWorkshopDto, GenericResponse, KnowledgeAreaDto, StatusWorkshop, WorkshopAreaDto, WorkshopsAreaDto } from '@comfeco/interfaces';

import { WorkshopsRepository } from './workshops.repository';

@Injectable()
export class WorkshopsService {

    constructor(private readonly _workshopsRepository: WorkshopsRepository) {}

    async knowledgeArea(): Promise<AreasDto | GenericResponse> {
        const knowledgesEntity:KnowledgeAreaDto[] = await this._workshopsRepository.knowledgeArea();
        
        if(knowledgesEntity==null) {
            return UtilResponse.genericResponse('',['No hay areas de conocimiento registradas en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        const knowledges:AreasDto = {
            code: HttpStatus.OK,
            areas: knowledgesEntity
        }

        return knowledges;
    }

    async workshopsArea(area:string): Promise<WorkshopsAreaDto | GenericResponse> {
        const workshopsEntity:AreaWorkshopDto[] = await this._workshopsRepository.workshopsToday(area);
        
        return this._collectionFiltering(workshopsEntity, 'No hay talleres proximos');
    }

    async workshopsAll(): Promise<WorkshopsAreaDto | GenericResponse> {
        const workshopsEntity:AreaWorkshopDto[] = await this._workshopsRepository.workshopsAll();

        return this._collectionFiltering(workshopsEntity, 'No hay talleres registrados en la base de datos');
    }

    private async _collectionFiltering(workshopsEntity:AreaWorkshopDto[], message:string): Promise<WorkshopsAreaDto | GenericResponse> {
        if(workshopsEntity==null) {
            return UtilResponse.genericResponse('',[message], HttpStatus.NOT_FOUND);
        }
        
        const timestamp:FirebaseFirestore.Timestamp = await this._workshopsRepository.sysdate();
        const sysdate = timestamp.toDate();
        
        const areasWorkshops:AreaWorkshopDto[] = [];

        workshopsEntity.forEach(
            data => {
                const workshopsData:WorkshopAreaDto[] = [];

                data.workshops.forEach(
                    (workshop:WorkshopAreaDto) => {
                        let status;
                        if(workshop.startTime.getTime() > sysdate.getTime()) {
                            status = StatusWorkshop.PENDING;
                        } else if(workshop.endTime.getTime() > sysdate.getTime()) {
                            status = StatusWorkshop.IN_PROGRESS;
                        } else {
                            status = StatusWorkshop.FINISHED;
                        }

                        workshopsData.push({
                            status,
                            ...workshop
                        });
                    }
                );

                areasWorkshops.push({
                    area: data.area,
                    workshops: workshopsData
                });
            }
        )

        const workshops:WorkshopsAreaDto = {
            code: HttpStatus.OK,
            areas: areasWorkshops
        }

        return workshops;
    }

}
