import { EventDayDto } from "@comfeco/interfaces";

export class EventDayUserDto {
    readonly event: EventDayDto;
    readonly register?: Date;
    readonly aborted?: Date;
}