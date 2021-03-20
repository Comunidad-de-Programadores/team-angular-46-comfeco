import { Injectable } from "@nestjs/common";
import { Bucket } from '@google-cloud/storage';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreRepository {
    
    get db(): admin.firestore.Firestore {
        return admin.firestore();
    }

    async storage(directory:string, file:any, name:string): Promise<string> {
        const fileName:string = `${directory}/${name}`;
        
        await this._bucket().file(fileName).save(file);
        
        const urlFile:string[] = await this._bucket().file(fileName).getSignedUrl({
            action: "read",
            expires: '01-01-2030'
        });

        const url:string = urlFile[0];
        
        return url;
    }

    private _bucket(): Bucket {
        return this._storage().bucket();
    }

    private _storage(): admin.storage.Storage {
        return admin.storage();
    }

    fieldValue() {
        return admin.firestore.FieldValue;
    }

    collection(collection:string): admin.firestore.CollectionReference {
        return admin.firestore().collection(collection);
    }

    document(document:string): admin.firestore.DocumentReference {
        return admin.firestore().doc(document);
    }

    timestampToDate(date:number) {
        return new Date(date * 1000);
    }

    async now(): Promise<FirebaseFirestore.Timestamp> {
        return await admin.firestore.Timestamp.now();
    }

    async todaysRank() {
        const currentTime:any = await this.now();
        const start = new Date(currentTime._seconds * 1000);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        const end = new Date(currentTime._seconds * 1000);
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        return [ start, end ];
    }

    async dateRank(minutesToStartDate:number, minutesToEndDate?:number) {
        const currentTime:Date = new Date();
        const start = new Date(currentTime);
        let end = new Date(currentTime);

        start.setMinutes(currentTime.getMinutes() - minutesToStartDate);

        if(!!minutesToEndDate) {
            end.setMinutes(currentTime.getMinutes() + minutesToEndDate);
        } else {
            const currentTime:any = await this.now();
            end = new Date(currentTime._seconds * 1000);
            end.setHours(23);
            end.setMinutes(59);
            end.setSeconds(59);
        }

        return [ start, end ];
    }

    async referenceDocumentId(collection:string, id:string): Promise<admin.firestore.DocumentReference> {
        return await this.collection(collection).doc(id);
    }

    async referenceDocumentKey(collection:string, keyReference:string, value:any): Promise<admin.firestore.DocumentReference> {
        const document:admin.firestore.QuerySnapshot = await this.collection(collection).where(keyReference, '==', value).get();
        const id:string = await this.idDocument(document);
        return this.collection(collection).doc(id);
    }

    async referenceDocument(collection:string, document:any): Promise<admin.firestore.DocumentReference> {
        const id:string = await this.idDocument(document);
        return this.collection(collection).doc(id);
    }
    
    async referenceDocuments(collection:string, keyReference:string, values:string[]): Promise<admin.firestore.DocumentReference[]> {
        return Promise.all(
            values.map(async (value:string) => await this.referenceDocumentKey(collection, keyReference, value))
        );
    }

    async returnInfoDocument(refDocument:admin.firestore.DocumentSnapshot) {
        if(!refDocument || !refDocument?.data()) {
            return [];
        }

        let finalData:admin.firestore.DocumentData | null = {};
        finalData.id = refDocument.id;

        for (const [key, value] of Object.entries(refDocument.data())) {
            finalData[key] = await this.childrenData(value);
        }

        return finalData;
    }
    
    async returnDocument(refDocument:admin.firestore.QuerySnapshot) {
        const dataResponse:admin.firestore.DocumentData | null = await this.returnDocuments(refDocument);
        return dataResponse.length > 0
                ? dataResponse[0]
                : null;
    }

    async returnDocuments(refDocument:admin.firestore.QuerySnapshot): Promise<admin.firestore.DocumentData | null> {
        return Promise.all(
            !refDocument.empty
            ? refDocument.docs.map(async(children:admin.firestore.QueryDocumentSnapshot) => {
                let finalData:admin.firestore.DocumentData | null = {};
                finalData.id = children.id;

                for (const [key, value] of Object.entries(children.data())) {
                    finalData[key] = await this.childrenData(value);
                }

                return finalData;
            })
            : []
        );
    }
    
    async childrenData(reference:admin.firestore.QueryDocumentSnapshot): Promise<admin.firestore.DocumentData | null> {
        let newValue:admin.firestore.DocumentData | null;
        if(reference instanceof admin.firestore.DocumentReference ||
            (
                reference instanceof Array && reference.length>0 && reference[0] instanceof admin.firestore.DocumentReference
                )
                ) {
            
            newValue = !Array.isArray(reference)
                ? await this.dataSimple(reference)
                : await this.dataArray(reference);
        } else {
            newValue = reference;
        }

        return newValue;
    }

    async dataSimple(dataRef:any): Promise<admin.firestore.DocumentData | null> {
        const segments: string[] = dataRef._path.segments;
        
        if(segments.length>0) {
            const registers: admin.firestore.DocumentSnapshot = await this.db.collection(segments[0]).doc(segments[1]).get();
            const data: admin.firestore.DocumentData = registers.data();
            
            if(data!==null && data!==undefined) {
                const responses: admin.firestore.DocumentData[] = Object.values(data);
                
                if(responses.length>1) {
                    return data;
                }

                return responses.length>0 ? responses[0] : null;
            }
        }

        return null;
    }

    async dataArray(dataDocs:any[]): Promise<admin.firestore.DocumentData[] | null> {
        return Promise.all(
            dataDocs.map(async (registers:any) => {
                const segments = registers._path.segments;
                
                return await this.dataSimple(registers);
            }));
    }


    async idDocument(refDocument:admin.firestore.QuerySnapshot): Promise<string | null> {
        const ids:string[] = await Promise.all(
            refDocument.docs.map(async(children:any) => children.id)
        );

        return ids.length>0 ? ids[0] : null;
    }

    idNewRegister(refDocument:any): string {
        const [,id] = refDocument._path.segments;
        return id;
    }

}