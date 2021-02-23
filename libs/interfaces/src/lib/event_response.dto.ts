import { GenericResponse } from "./generic_response.dto";

export class EventDto extends GenericResponse {
    readonly welcome: string;
    readonly subtitule: string;
    readonly description: string;
    readonly dateEvent: Date;
}