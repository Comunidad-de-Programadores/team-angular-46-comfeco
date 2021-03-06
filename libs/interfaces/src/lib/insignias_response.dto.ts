import { GenericResponse } from "./generic_response.dto";
import { InsigniaDto } from "./insignia_response.dto";

export class InsigniasDto extends GenericResponse {
    readonly insignias: InsigniaDto[];
}