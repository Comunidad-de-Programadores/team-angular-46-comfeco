import { GenericResponse } from "./generic_response.dto";
import { GroupDto } from "./group_response.dto";

export class GroupsDto extends GenericResponse {
    readonly groups: GroupDto[];
}