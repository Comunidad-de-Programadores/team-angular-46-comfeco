import { EventDayDto } from "./event_day_response.dto";
import { GenericResponse } from "./generic_response.dto";
import { InsigniaDto } from "./insignia_response.dto";

export class EventsDayDto extends GenericResponse {
    readonly events: EventDayDto[];
    readonly insignia?: InsigniaDto;
}