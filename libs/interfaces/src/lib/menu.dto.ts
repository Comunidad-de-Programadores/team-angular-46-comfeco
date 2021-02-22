import { GenericResponse } from "./generic_response.dto";
import { MenuOptionDto } from "./menu_option.dto";

export class MenuDto extends GenericResponse {
    readonly options: MenuOptionDto[];
}