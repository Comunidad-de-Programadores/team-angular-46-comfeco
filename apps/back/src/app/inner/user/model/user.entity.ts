import { Status, Rol, AccountType, KnowledgeAreaDto, Gender, CountryDto, GroupDto } from "@comfeco/interfaces";

import { FacebookEntity } from "./facebook.entity";
import { GoogleEntity } from "./google.entity";
import { InsigniaUserEntity } from "./insignia_user.entity";
import { SocialNetworkEntity } from "./social_network.entity";

export interface UserEntity {
    id?:string,
    name?:string,
    lastname?:string,
    description?:string,
    birdth_date?:Date,
    specialities?:KnowledgeAreaDto[],
    social_networks?:SocialNetworkEntity[],
    country?:CountryDto,
    gender?:Gender,
    group?:GroupDto,
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
    insignias?:InsigniaUserEntity[],
    level?:string;
}