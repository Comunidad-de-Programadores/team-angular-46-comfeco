import { GenericResponse } from "./generic_response.dto";
import { GroupDto } from "./group_response.dto";
import { InsigniaDto } from "./insignia_response.dto";
import { UsersGroupDto } from "./users_group_response.dto";

export class UserGroupDto extends GenericResponse {
    readonly group: GroupDto;
    readonly users: UsersGroupDto[];
    readonly insignia?: InsigniaDto;
}