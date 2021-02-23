import { GenericResponse } from "./generic_response.dto";
import { ExhibitorDto } from './exhibitor_response.dto';

export class ExhibitorsDto extends GenericResponse {
    readonly exhibitors: ExhibitorDto[];
}