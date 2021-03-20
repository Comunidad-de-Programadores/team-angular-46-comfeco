import { TechnologieDto } from "./technologie_response.dto";

export class GroupDto {
    readonly id?:string;
    readonly order?:number;
    readonly name:string;
    readonly language?:TechnologieDto;
    readonly penality?:boolean;
    readonly description?:string;
    readonly active?:boolean;
    readonly belong:boolean;
}