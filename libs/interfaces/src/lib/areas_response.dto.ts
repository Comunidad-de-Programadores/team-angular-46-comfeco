import { GenericResponse } from "./generic_response.dto";
import { KnowledgeAreaDto } from "./knowledge_area_response.dto";

export class AreasDto extends GenericResponse {
    readonly areas: KnowledgeAreaDto[];
}