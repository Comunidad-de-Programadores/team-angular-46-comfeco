import { EventDayDto } from "@comfeco/interfaces";

export class EventDayUserDto {
    readonly event: EventDayDto;
    readonly register?: Date;
    readonly aborted?: boolean;
    readonly date_aborted?: Date;
}