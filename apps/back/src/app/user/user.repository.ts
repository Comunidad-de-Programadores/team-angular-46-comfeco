import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Status, Rol, AccountType, RegisterDto } from '@comfeco/interfaces';

import { UserEntity } from './user.entity';
import { FirestoreRepository } from '../../config/db/firestore.repository';

@Injectable()
export class UserRepository {

    private _coleccion:string = 'users';

    constructor(private readonly db: FirestoreRepository) {}

    async userExists(user:string): Promise<UserEntity> {
        const baseUsers = await this.db.collection(this._coleccion).where('user', '==', user).get();
        return await this.db.returnDocument(baseUsers);
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

    async registerUserEmail(registerDto: RegisterDto, tokenApi:string): Promise<void> {
        const { user, email, password } = registerDto;
        const encryptedPassword = await bcrypt.hash(password, 10);
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
            type,
            tokenApi
        }

        await emailBase!==null 
            ? this.db.collection(this._coleccion).doc(user).update(entity)
            : this.db.collection(this._coleccion).add(entity);
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
            password: userDetail.password
        };

        if(entity.password===undefined) delete entity.password;

        await userReferences.update(entity);
    }

}
