import { Module } from '@nestjs/common';
import { FirestoreModule } from '../../config/db/firestore.module';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';
import { EventsService } from './events.service';

@Module({
  controllers: [EventsController],
  imports: [FirestoreModule],
  providers: [EventsService, EventsRepository]
})
export class EventsModule {}
