import { Injectable } from '@angular/core';

import { CommunitiesService } from './communities.service';
import { CountrysService } from './countrys.service';
import { EventsService } from './events.service';
import { ExhibitorsService } from './exhibitors.service';
import { GendersService } from './genders.service';
import { InsigniasService } from './insignias.service';
import { KnowledgeAreaService } from './knowledge-area.service';
import { LanguagesService } from './languages.service';
import { SponsorsService } from './sponsors.service';
import { WorkshopsService } from './workshops.service';

@Injectable({
  providedIn: 'root'
})
export class CleanService {

  constructor(
    private _communitiesService: CommunitiesService,
    private _countrysService: CountrysService,
    private _eventsService: EventsService,
    private _exhibitorsService: ExhibitorsService,
    private _gendersService: GendersService,
    private _insigniasService: InsigniasService,
    private _knowledgeAreaService: KnowledgeAreaService,
    private _languagesService: LanguagesService,
    private _sponsorsService: SponsorsService,
    private _workshopsService: WorkshopsService,
  ) {}
  
  clean() {
    this._communitiesService.clean();
    this._countrysService.clean();
    this._eventsService.clean();
    this._exhibitorsService.clean();
    this._gendersService.clean();
    this._insigniasService.clean();
    this._knowledgeAreaService.clean();
    this._languagesService.clean();
    this._sponsorsService.clean();
    this._workshopsService.clean();
  }

}
