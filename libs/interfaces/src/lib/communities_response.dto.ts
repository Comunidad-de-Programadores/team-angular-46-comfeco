import { GenericResponse } from "./generic_response.dto";
import { CommunityDto } from "./community_response.dto";

export class CommunitiesDto extends GenericResponse {
    readonly communities: CommunityDto[];
}