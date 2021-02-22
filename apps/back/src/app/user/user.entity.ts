import { Status, Rol, AccountType } from "@comfeco/interfaces";
import { FacebookEntity } from "./model/facebook.entity";
import { GoogleEntity } from "./model/google.entity";

export interface UserEntity {
    name?:string;
    lastname?:string;
    email?: string,
    password?: string,
    roles?: Rol[];
    status?: Status,
    type?: AccountType[],
    photoUrl?: string;
    facebook?: FacebookEntity,
    google?: GoogleEntity,
    tokenApi?: string,
    user?:string
}