import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';

import { Status, Rol, AccountType, RegisterDto } from '@comfeco/interfaces';

import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {

    private _coleccion:string = 'users';

    async userExists(user:string): Promise<UserEntity> {
        const db = admin.firestore();
        const baseUsers = db.collection(this._coleccion);
        const baseUser = await baseUsers.doc(user).get();
        
        if(!baseUser.exists) {
           return null;
        }

        return baseUser.data();
    }
    
    async emailExists(email:string): Promise<UserEntity> {
        const db = admin.firestore();
        const baseEmail = await db.collection(this._coleccion).where('email', '==', email).get();
        const registeredEmails:any[] = [];
        
        baseEmail.forEach(doc => {
            registeredEmails.push(doc.data());
        });
        
        if(registeredEmails.length==0) {
            return null;
        }
        
        return registeredEmails[0];
    }

    async emaiTypeExists(email:string): Promise<UserEntity> {
        const db = admin.firestore();
        const baseEmail = await db.collection(this._coleccion)
                                    .where('email', '==', email)
                                    .where('type', '==', AccountType.EMAIL)
                                    .get();

        const registeredEmails:any[] = [];
        
        baseEmail.forEach(doc => {
            registeredEmails.push(doc.data());
        });
        
        if(registeredEmails.length==0) {
            return null;
        }
        
        return registeredEmails[0];
    }

    async tokenChangePasswordExists(token:string): Promise<UserEntity> {
        const db = admin.firestore();
        const baseToken = await db.collection(this._coleccion).where('tokenApi', '==', token).get();
        const collectionsFound:any[] = [];
        
        baseToken.forEach(doc => {
            collectionsFound.push(doc.data());
        });
        
        if(collectionsFound.length==0) {
            return null;
        }

        return collectionsFound[0];
    }

    async registerUserEmail(registerDto: RegisterDto, tokenApi:string): Promise<void> {
        const { user, email, password } = registerDto;

        const base = admin.firestore();
        const register = base.collection(this._coleccion).doc(user);
        
        const encryptedPassword = await bcrypt.hash(password, 10);
        
        const { name='', lastname='', lastname_m='' } = registerDto;
        
        const entity:UserEntity = {
            user,
            name,
            lastname,
            lastname_m,
            email,
            password: encryptedPassword,
            roles: [ Rol.INVITED ],
            status: Status.ACTIVE,
            type: AccountType.EMAIL,
            tokenApi
        }

        await register.set(entity);
    }

    async registerUserSocialNetwork(account:UserEntity): Promise<void> {
        const base = admin.firestore();
        const document = base.collection(this._coleccion).doc(account.user);
        
        const entity: UserEntity = {
            roles: [ Rol.INVITED ],
            status: Status.ACTIVE,
            user:account.user,
            ...account
        };
        
        await document.set(entity);
    }

    async updateTokenUser(userDetail:UserEntity): Promise<void> {
        await admin.firestore().collection(this._coleccion).doc(userDetail.user).update(userDetail);
    }
    
}
