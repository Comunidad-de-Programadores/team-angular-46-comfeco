import { Injectable } from '@nestjs/common';

import { FirestoreRepository } from '../../../config/db/firestore.repository';

@Injectable()
export class MenuRepository {

    private _coleccion:string = 'menu';

    constructor(private readonly db: FirestoreRepository) {}
    
    async menu() {
        const baseOptions = await this.db.collection(this._coleccion).orderBy('order', 'asc').get();
        return await this.db.returnDocuments(baseOptions);
    }

}
