import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Status, Rol, AccountType, RegisterDto } from '@comfeco/interfaces';

import { FirestoreRepository } from '../../../config/db/firestore.repository';
import { UserEntity } from './model/user.entity';
import { environment } from '../../../environments/environment';


@Injectable()
export class UserRepository {

    private _coleccion:string = 'users';

    constructor(private readonly db: FirestoreRepository) {}

    async referenceKnowledgeArea(id:string): Promise<any> {
        const refKnowledgeArea = await this.db.referenceDocumentId('knowledge_area', id);
        return refKnowledgeArea;
    }

    async referenceGender(id:string): Promise<any> {
        const refGender = await this.db.referenceDocumentId('gender', id);
        return refGender;
    }

    async informationGender(prefix:string): Promise<any> {
        const baseGenders = await this.db.collection('gender').where('prefix', '==', prefix).get();
        return await this.db.returnDocument(baseGenders);
    }

    async updateUser(id:string, data:any): Promise<any> {
        const baseUsers = await this.db.collection(this._coleccion).doc(id).update(data);
        return baseUsers;
    }

    async updateSocialNetworksUser(id:string, data:any): Promise<any> {
        const baseSocial = await this.db
            .collection(this._coleccion)
            .doc(id)
            .collection('social_networks')
            .where('type', '==', data.type)
            .get();

        const entitySocial = await this.db.returnDocument(baseSocial);

        if(entitySocial) {
            await this.db
                .collection(this._coleccion)
                .doc(id)
                .collection('social_networks')
                .doc(entitySocial.id)
                .update({url:data.url});
        } else {
            const { type, url } = data;
            await this.db
                .collection(this._coleccion)
                .doc(id)
                .collection('social_networks')
                .add({type, url });
        }
    }

    async getSocialNetworkUser(id:string, type:any): Promise<any> {
        const baseSocial = await this.db
            .collection(this._coleccion)
            .doc(id)
            .collection('social_networks')
            .where('type', '==', type)
            .get();

        return await this.db.returnDocument(baseSocial);
    }

    async insigniaReference(insignia:number): Promise<any> {
        return await this.db.referenceDocumentKey('insignia', 'order', insignia);
    }

    async insigniaInformation(insignia:number): Promise<any> {
        const baseInsignia = await this.db
            .collection('insignia')
            .where('order', '==', insignia)
            .get();

        return await this.db.returnDocument(baseInsignia);
    }

    async addInsigniaUser(id:string, insignia:any): Promise<any> {
        const baseInsignia = await this.db
            .collection(this._coleccion)
            .doc(id)
            .collection('insignias')
            .where('insignia', '==', insignia)
            .get();

        const entityInsignia = await this.db.returnDocument(baseInsignia);

        if(!entityInsignia) {
            await this.db
                .collection(this._coleccion)
                .doc(id)
                .collection('insignias')
                .add({insignia, obtain: new Date() });
        }

        return !entityInsignia;
    }

    async upload(file:any, id:string): Promise<string> {
        return await this.db.storage(`${this._coleccion}/${id}`, file, 'profile.jpg');
    }

    async idExists(id:string): Promise<UserEntity> {
        const baseUser = await this.db.collection(this._coleccion).doc(id).get();
        return await this.db.returnInfoDocument(baseUser);
    }

    async userExists(user:string): Promise<UserEntity> {
        const baseUsers = await this.db.collection(this._coleccion).where('user', '==', user).get();
        return await this.db.returnDocument(baseUsers);
    }

    async insignias(id:string): Promise<any> {
        const baseUsers = await this.db.collection(this._coleccion).doc(id).collection('insignias').get();
        return await this.db.returnDocuments(baseUsers);
    }

    async allEvents(id:string) {
        const baseEventsUser = await this.db.collection('users').doc(id).collection('events_day').get();
        return await this.db.returnDocuments(baseEventsUser);
    }

    async events(id:string): Promise<any> {
        const baseUsers = await this.db.collection(this._coleccion).doc(id).collection('events_day').where('aborted','==', false).orderBy('register','desc').get();
        return await this.db.returnDocuments(baseUsers);
    }

    async event(order:number): Promise<any> {
        const baseEvent = await this.db.collection('events_day').where('order','==', order).get();
        return await this.db.returnDocument(baseEvent);
    }

    async addEvent(id:string, event:string): Promise<any> {
        const eventRef = await this.db.collection('events_day').doc(event);
        const baseEvent = await this.db.collection(this._coleccion).doc(id).collection('events_day').where('event','==', eventRef).get();

        const data:UserEntity = await this.db.returnDocument(baseEvent);
        if(data) {
            return false;
        }
        
        await this.db
            .collection(this._coleccion)
            .doc(id)
            .collection('events_day')
            .add({event: eventRef, aborted: false, register: new Date() });
        
        return true;
    }

    async leaveEvent(id:string, event:string): Promise<any> {
        const eventRef = await this.db.collection('events_day').doc(event);
        const baseEvent = await this.db.collection(this._coleccion).doc(id).collection('events_day').where('event','==', eventRef).get();

        const data:UserEntity = await this.db.returnDocument(baseEvent);
        if(!data) {
            return false;
        }
        
        await this.db
            .collection(this._coleccion)
            .doc(id)
            .collection('events_day')
            .doc(data.id)
            .update({aborted: true, date_aborted: new Date() });
        
        return true;
    }

    async recentEventsRegisterActivity(id:string): Promise<any> {
        const [ start, end ] = await this.db.dateRank(15);
        const baseUsers = await this.db.collection(this._coleccion).doc(id).collection('events_day')
            .where('register', '>=', start)
            .where('register', '<=', end)
            .get();
        return await this.db.returnDocuments(baseUsers);
    }

    async recentEventsLeaveActivity(id:string): Promise<any> {
        const [ start, end ] = await this.db.dateRank(15);
        const baseUsers = await this.db.collection(this._coleccion).doc(id).collection('events_day')
            .where('date_aborted', '>=', start)
            .where('date_aborted', '<=', end)
            .get();
        return await this.db.returnDocuments(baseUsers);
    }

    async recentInsigniasObtainActivity(id:string): Promise<any> {
        const [ start, end ] = await this.db.dateRank(15);
        const baseUsers = await this.db.collection(this._coleccion).doc(id).collection('insignias')
            .where('obtain', '>=', start)
            .where('obtain', '<=', end)
            .get();
        return await this.db.returnDocuments(baseUsers);
    }

    async groupById(id:string): Promise<any> {
        const baseUsers = await this.db.collection('groups').doc(id).get();
        return await this.db.returnInfoDocument(baseUsers);
    }

    async joinGroup(idGroup:string, idUser:string): Promise<any> {
        const groupRef = await this.db.collection('groups').doc(idGroup);
        await this.db
            .collection(this._coleccion)
            .doc(idUser)
            .update({group: groupRef });

        return true;
    }

    async leaveGroup(idUser:string): Promise<any> {
        await this.db
            .collection(this._coleccion)
            .doc(idUser)
            .update({group: this.db.fieldValue().delete() });

        return true;
    }

    async usersByGroup(order:number): Promise<any> {
        const groupRef:any = await this.db.referenceDocumentKey('groups', 'order', order);
        const baseUsers = await this.db.collection(this._coleccion).where('group','==', groupRef).get();

        return await this.db.returnDocuments(baseUsers);
    }

    async languageByGroup(id:string): Promise<any> {
        if(!id) return null;
        const baseLanguage = await this.db.collection('technologies').doc(id).get();

        return await this.db.returnInfoDocument(baseLanguage);
    }

    async userSocialNetworks(id:string): Promise<any> {
        const baseSocial = await this.db.collection(this._coleccion).doc(id).collection('social_networks').get();

        return await this.db.returnDocuments(baseSocial);
    }

    async emailExists(email:string): Promise<UserEntity> {
        const baseEmails:any = await this.db.collection(this._coleccion).where('email', '==', email).get();
        return await this.db.returnDocument(baseEmails);
    }

    async emaiTypeExists(email:string): Promise<UserEntity> {
        const type:any = await this.db.referenceDocumentKey('type_account', 'type', AccountType.EMAIL);
        const baseEmails:any = await this.db.collection(this._coleccion)
                                    .where('email', '==', email)
                                    .where('type', 'array-contains-any', [ type ])
                                    .get();

        return await this.db.returnDocument(baseEmails);
    }

    async tokenChangePasswordExists(token:string): Promise<UserEntity> {
        const baseToken = await this.db.collection(this._coleccion).where('tokenApi', '==', token).get();
        return await this.db.returnDocument(baseToken);
    }

    async registerUserEmail(registerDto: RegisterDto): Promise<void> {
        const { user, email, password } = registerDto;
        const encryptedPassword = await bcrypt.hash(password, environment.salt_rounds);
        const { name='', lastname='' } = registerDto;

        const rolesReferences = await this.db.referenceDocumentKey('roles', 'role', Rol.INVITED);
        const statusReferences = await this.db.referenceDocumentKey('status_account', 'status', Status.ACTIVE);
        const typeReferences = await this.db.referenceDocumentKey('type_account', 'type', AccountType.EMAIL);
        const emailBase = await this.emailExists(email);
        let type: any[];

        if(emailBase!==null) {
            const types = await this.db.collection('type_account').where('type', 'in', emailBase.type).get();
            const typesReferences:any = await this.db.referenceDocument('type_account', types);
            type = [...new Set([...typesReferences, typeReferences])];
        } else {
            type = [ typeReferences ];
        }

        const entity = {
            user,
            name,
            lastname,
            email,
            password: encryptedPassword,
            roles: [ rolesReferences ],
            status: statusReferences,
            type
        }

        await emailBase!==null 
            ? this.db.collection(this._coleccion).doc(emailBase.id).update(entity)
            : this.db.collection(this._coleccion).add(entity);
    }

    async updateTokenApi(userDetail:UserEntity) {
        const userReferences = await this.db.collection(this._coleccion).doc(userDetail.id);

        const entity = {
            tokenApi: userDetail.tokenApi,
            tokenRefreshApi: userDetail.tokenRefreshApi,
            password: userDetail.password
        };

        if(entity.password===undefined) delete entity.password;

        await userReferences.update(entity);
    }

    async registerUserSocialNetwork(account:UserEntity): Promise<void> {
        const userDocument = await this.db.collection(this._coleccion).where('user', '==', account.user).get();
        const userBase = await this.db.returnDocument(userDocument);
        const userReferences = userBase==null ? null : await this.db.referenceDocument(this._coleccion, userDocument);
        const rolesReferences = await this.db.referenceDocumentKey('roles', 'role', Rol.INVITED);
        const statusReferences = await this.db.referenceDocumentKey('status_account', 'status', Status.ACTIVE);
        const typesCollection:any = await this.db.referenceDocuments('type_account', 'type', account.type);
        const {name, lastname, email, facebook, google, user} = account;

        const entity = {
            roles: [ rolesReferences ],
            status: statusReferences,
            type: typesCollection,
            name,
            lastname,
            email,
            facebook,
            google,
            user
        };

        if(google===undefined) delete entity.google;
        if(facebook===undefined) delete entity.facebook;
        if(userBase!==null) delete entity.user;
        
        await userBase!==null
            ? userReferences.set(entity, { merge: true})
            : this.db.collection(this._coleccion).add(entity);
    }

    async updateTokenUser(userDetail:UserEntity): Promise<void> {
        const userDocument = await this.db.collection(this._coleccion).where('user', '==', userDetail.user).get();
        const userReferences = await this.db.referenceDocument(this._coleccion, userDocument);

        const entity = {
            tokenApi: userDetail.tokenApi,
            tokenRefreshApi: userDetail.tokenRefreshApi,
            password: userDetail.password
        };

        if(entity.password===undefined) delete entity.password;

        await userReferences.update(entity);
    }

}
