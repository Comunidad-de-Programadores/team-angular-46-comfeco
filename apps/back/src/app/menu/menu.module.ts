import { Module } from '@nestjs/common';
import { FirestoreModule } from '../../config/db/firestore.module';

import { MenuController } from './menu.controller';
import { MenuRepository } from './menu.respository';
import { MenuService } from './menu.service';

@Module({
  controllers: [MenuController],
  imports: [FirestoreModule],
  providers: [MenuService, MenuRepository]
})
export class MenuModule {}
