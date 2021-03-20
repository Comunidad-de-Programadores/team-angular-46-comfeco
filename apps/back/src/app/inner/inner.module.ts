import { HttpModule, Module } from '@nestjs/common';

import { ConfigModule } from '../../config/config.module';
import { JwtUtilModule } from '../../util/jwt/jwt.module';
import { CommunitiesService } from './communities/communities.service';
import { CommunitiesRepository } from './communities/communities.repository';
import { CountryService } from './country/country.service';
import { EventsService } from './events/events.service';
import { EventsRepository } from './events/events.repository';
import { EventsDayService } from './events-day/events-day.service';
import { EventsDayRepository } from './events-day/events-day.repository';
import { ExhibitorsRepository } from './exhibitors/exhibitors.repository';
import { ExhibitorsService } from './exhibitors/exhibitors.service';
import { GenderService } from './gender/gender.service';
import { GenderRepository } from './gender/gender.repository';
import { InsigniaService } from './insignia/insignia.service';
import { InsigniaRepository } from './insignia/insignia.repository';
import { MenuService } from './menu/menu.service';
import { MenuRepository } from './menu/menu.respository';
import { SponsorsService } from './sponsors/sponsors.service';
import { SponsorsRepository } from './sponsors/sponsors.repository';
import { SubmenuUserProfileService } from './submenu-user-profile/submenu-user-profile.service';
import { SubmenuUserProfileRepository } from './submenu-user-profile/submenu-user-profile.repository';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { WorkshopsService } from './workshops/workshops.service';
import { WorkshopsRepository } from './workshops/workshops.repository';
import { FirestoreModule } from '../../config/db/firestore.module';
import { ConfigService } from '../../config/config.service';
import { CommunitiesController } from './communities/communities.controller';
import { CountryController } from './country/country.controller';
import { EventsController } from './events/events.controller';
import { EventsDayController } from './events-day/events-day.controller';
import { ExhibitorsController } from './exhibitors/exhibitors.controller';
import { GenderController } from './gender/gender.controller';
import { InsigniaController } from './insignia/insignia.controller';
import { MenuController } from './menu/menu.controller';
import { SponsorsController } from './sponsors/sponsors.controller';
import { SubmenuUserProfileController } from './submenu-user-profile/submenu-user-profile.controller';
import { UserController } from './user/user.controller';
import { WorkshopsController } from './workshops/workshops.controller';
import { GroupsController } from './groups/groups.controller';
import { GroupsService } from './groups/groups.service';
import { GroupsRepository } from './groups/groups.repository';
import { TechnologiesController } from './technologies/technologies.controller';
import { TechnologiesService } from './technologies/technologies.service';
import { TechnologiesRepository } from './technologies/technologies.repository';

const Controllers = [
    CommunitiesController,
    CountryController,
    EventsController,
    EventsDayController,
    ExhibitorsController,
    GenderController,
    GroupsController,
    InsigniaController,
    MenuController,
    SponsorsController,
    SubmenuUserProfileController,
    TechnologiesController,
    UserController,
    WorkshopsController
];

const Services = [
    CommunitiesService, CommunitiesRepository,
    CountryService,
    EventsService, EventsRepository,
    EventsDayService, EventsDayRepository,
    ExhibitorsService, ExhibitorsRepository,
    GenderService, GenderRepository,
    GroupsService, GroupsRepository,
    InsigniaService, InsigniaRepository,
    MenuService, MenuRepository,
    SponsorsService, SponsorsRepository,
    SubmenuUserProfileService, SubmenuUserProfileRepository,
    TechnologiesService, TechnologiesRepository,
    UserService, UserRepository,
    WorkshopsService, WorkshopsRepository
];

@Module({
    controllers: [
        ...Controllers,
    ],
    imports: [
        HttpModule,
        FirestoreModule,
        JwtUtilModule,
        ConfigModule
    ],
    providers: [
        ConfigService,
        ...Services,
    ],
    exports: [
        UserRepository
    ]
})
export class InnerModule {}
