import { AreaWorkshopDto } from "./area_workshop_response.dto";
import { GenericResponse } from "./generic_response.dto";

export class WorkshopsAreaDto extends GenericResponse {
    readonly areas: AreaWorkshopDto[];
}