import { Module } from '@nestjs/common';
import { FirestoreModule } from '../../config/db/firestore.module';
import { SponsorsController } from './sponsors.controller';
import { SponsorsRepository } from './sponsors.repository';
import { SponsorsService } from './sponsors.service';

@Module({
  controllers: [SponsorsController],
  imports: [FirestoreModule],
  providers: [SponsorsService, SponsorsRepository]
})
export class SponsorsModule {}
