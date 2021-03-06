import { Status, Rol, AccountType, KnowledgeAreaDto, Gender } from "@comfeco/interfaces";

import { FacebookEntity } from "./facebook.entity";
import { GoogleEntity } from "./google.entity";
import { SocialNetworkEntity } from "./social_network.entity";

export interface UserEntity {
    id?:string,
    name?:string,
    lastname?:string,
    description?:string,
    specialty?:KnowledgeAreaDto,
    social_networks?:SocialNetworkEntity[],
    gender?:Gender,
    email?: string,
    password?: string,
    roles?: Rol[];
    status?: Status,
    type?: AccountType[],
    photoUrl?: string;
    facebook?: FacebookEntity,
    google?: GoogleEntity,
    tokenApi?: string,
    tokenRefreshApi?: string,
    user?:string,
    modify?:boolean,
}