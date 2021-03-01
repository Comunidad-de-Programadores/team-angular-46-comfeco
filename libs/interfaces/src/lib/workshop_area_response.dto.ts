import { StatusWorkshop } from "../enum/status_workshop.enum";

export class WorkshopAreaDto {
    readonly author: string;
    readonly startTime: Date;
    readonly endTime: Date;
    readonly urlSocialNetwork: string;
    readonly urlWorkshop: string;
    readonly topic: string;
    readonly description: string;
    readonly status?: StatusWorkshop;
}