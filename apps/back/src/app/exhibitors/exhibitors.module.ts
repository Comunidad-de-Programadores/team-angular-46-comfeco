import { Module } from '@nestjs/common';
import { FirestoreModule } from '../../config/db/firestore.module';
import { ExhibitorsController } from './exhibitors.controller';
import { ExhibitorsRepository } from './exhibitors.repository';
import { ExhibitorsService } from './exhibitors.service';

@Module({
  controllers: [ExhibitorsController],
  imports: [FirestoreModule],
  providers: [ExhibitorsService, ExhibitorsRepository]
})
export class ExhibitorsModule {}
