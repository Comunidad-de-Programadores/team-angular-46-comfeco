export class EventDayDto {
    readonly image: string;
    readonly name: string;
    readonly description?: string;
    readonly register?: Date;
    readonly aborted?: boolean;
}