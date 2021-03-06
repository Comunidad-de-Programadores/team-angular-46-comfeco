import { Module } from '@nestjs/common';

import { FirestoreRepository } from './firestore.repository';

@Module({
    providers: [
        FirestoreRepository,
    ],
    exports: [
        FirestoreRepository,
    ]
})
export class FirestoreModule {}
