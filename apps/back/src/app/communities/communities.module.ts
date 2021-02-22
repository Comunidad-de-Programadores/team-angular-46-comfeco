import { Module } from '@nestjs/common';
import { FirestoreModule } from '../../config/db/firestore.module';
import { CommunitiesController } from './communities.controller';
import { CommunitiesRepository } from './communities.repository';
import { CommunitiesService } from './communities.service';

@Module({
  controllers: [CommunitiesController],
  imports: [FirestoreModule],
  providers: [CommunitiesService, CommunitiesRepository]
})
export class CommunitiesModule {}
