import { TechnologieDto } from "..";
import { GenericResponse } from "./generic_response.dto";

export class TechnologiesDto extends GenericResponse {
    readonly technologies: TechnologieDto[];
}