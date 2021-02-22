import { Module } from '@nestjs/common';

import { JwtUtilModule } from '../../util/jwt/jwt.module';
import { FirestoreModule } from '../../config/db/firestore.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService, UserRepository],
    imports: [JwtUtilModule, FirestoreModule],
    exports: [UserRepository],
})
export class UserModule {}
