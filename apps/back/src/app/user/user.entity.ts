import { Status, Rol, AccountType } from "@comfeco/interfaces";

export interface UserEntity {
    name?:string;
    lastname?:string;
    lastname_m?:string;
    email?: string,
    password?: string,
    roles?: Rol[];
    status?: Status,
    type?: AccountType,
    idFacebook?:string,
    tokenFaceook?:string,
    tokenGoogle?:string,
    tokenApi?:string,
    user?:string
}