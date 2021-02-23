import { WorkshopAreaDto } from "./workshop_area_response.dto";

export class AreaWorkshopDto {
    readonly area: string;
    readonly workshops: WorkshopAreaDto[];
}