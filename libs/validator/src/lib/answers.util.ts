import { HttpStatus } from "@nestjs/common";

import { GenericResponse } from "@comfeco/interfaces";

export class UtilResponse {

    static genericResponse(message:string, errors:string[], code:HttpStatus): GenericResponse {
        if(message!='') {
            return {
                code,
                message
            };
        } else {
            return {
                code,
                errors
            };
        }
    }
    
}