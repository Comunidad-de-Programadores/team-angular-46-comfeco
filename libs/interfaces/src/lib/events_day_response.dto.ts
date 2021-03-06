import { EventDayDto } from "./event_day_response.dto";
import { GenericResponse } from "./generic_response.dto";

export class EventsDayDto extends GenericResponse {
    readonly events: EventDayDto[];
}