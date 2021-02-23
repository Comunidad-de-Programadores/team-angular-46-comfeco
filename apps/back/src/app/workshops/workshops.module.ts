import { Module } from '@nestjs/common';

import { FirestoreModule } from '../../config/db/firestore.module';
import { WorkshopsController } from './workshops.controller';
import { WorkshopsRepository } from './workshops.repository';
import { WorkshopsService } from './workshops.service';

@Module({
  controllers: [WorkshopsController],
  imports: [FirestoreModule],
  providers: [WorkshopsService, WorkshopsRepository]
})
export class WorkshopsModule {}
