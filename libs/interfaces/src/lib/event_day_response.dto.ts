export class EventDayDto {
    readonly id: string;
    readonly image: string;
    readonly name: string;
    readonly description?: string;
    readonly register?: Date;
    readonly order?: number;
    readonly date_aborted?: Date;
    readonly aborted?: boolean;
    readonly participating?: boolean;
}