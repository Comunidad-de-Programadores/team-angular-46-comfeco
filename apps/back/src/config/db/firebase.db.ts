import * as admin from 'firebase-admin';

export class FirebaseDataBase {
    
    connect(): void {
        const params = {
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };

        if(!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(params),
                databaseURL: process.env.FIREBASE_DATABASE
            });
        }
    }
    
}