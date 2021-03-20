import { GenericResponse } from "./generic_response.dto";
import { MenuOptionUserProfileDto } from "./submenu_option_user_profile_response.dto";

export class MenuUserProfileDto extends GenericResponse {
    readonly options: MenuOptionUserProfileDto[];
}