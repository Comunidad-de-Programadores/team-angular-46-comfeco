import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from "rxjs";

import { AreaWorkshopDto, ComboInterface, CommunityDto, DayEvent, EventDto, ExhibitorDto, KnowledgeAreaDto, SponsorDto, WorkshopAreaDto } from '@comfeco/interfaces';
import { SpinnerService } from '@comfeco/api';

import { DashboardService } from './page-dashboard.service';
import { CommunitiesService } from '../../@core/services/communities.service';
import { ExhibitorsService } from '../../@core/services/exhibitors.service';
import { SponsorsService } from '../../@core/services/sponsors.service';
import { WorkshopsService } from '../../@core/services/workshops.service';
import { KnowledgeAreaService } from '../../@core/services/knowledge-area.service';
import { EventsService } from '../../@core/services/events.service';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';

@Component({
  selector: 'comfeco-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageDashboardComponent implements OnInit, OnDestroy {

  communities:CommunityDto[];
  comboKnowledgeArea:ComboInterface[] = [];
  workshops:WorkshopAreaDto[] = [];
  idArea:string;
  exhibitors:ExhibitorDto[];
  sponsors:SponsorDto[];
  eventInfo:EventDto;
  dayEvent:DayEvent;

  messageErrorCommunities:string;
  messageErrorWorkshops:string;

  communitiesSubscription$:Subscription;
  exhibitorsSubscription$:Subscription;
  sponsorsSubscription$:Subscription;
  workshopsByAreaSubscription$:Subscription;
  knowledgeAreaSubscription$:Subscription;
  eventGlobalSubscription$:Subscription;
  unsubscribe$ = new Subject<void>();

  constructor(
    private _service: DashboardService,
    private _serviceCommunities: CommunitiesService,
    private _exhibitorsService: ExhibitorsService,
    private _sponsorsService: SponsorsService,
    private _workshopsService: WorkshopsService,
    private _knowledgeAreaService: KnowledgeAreaService,
    private _eventsService: EventsService,
    private notification: LayoutComfecoService,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.completeCommunities();
    this.completeKnowledgeArea();
    this.completeExhibitors();
    this.completeSponsors();
    this.completeEventInfo(); 
  }

  ngOnDestroy(): void {
    this.unsubscribe$?.next();
    this.unsubscribe$?.complete();
    this.communitiesSubscription$?.unsubscribe();
    this.exhibitorsSubscription$?.unsubscribe();
    this.sponsorsSubscription$?.unsubscribe();
    this.workshopsByAreaSubscription$?.unsubscribe();
    this.knowledgeAreaSubscription$?.unsubscribe();
    this.eventGlobalSubscription$?.unsubscribe();
  }

  completeCommunities() {
    this.spinner.show();
    this.communitiesSubscription$ = this._serviceCommunities.firstCommunities()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.communities) {
              this.communities = resp.communities;
            }
          } else {
            this.messageErrorCommunities = resp.message;
          }
          this.spinner.hidde();
        }
      );
  }

  completeKnowledgeArea() {
    this.spinner.show();
    this.knowledgeAreaSubscription$ = this._knowledgeAreaService.knowledgeArea()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.areas) {
              resp.areas.forEach((areaTemp:KnowledgeAreaDto) => {
                const { area, id } = areaTemp;
                const combo:ComboInterface = {
                  value: area,
                  id
                };
                this.comboKnowledgeArea.push(combo);
              });
            }
            this.spinner.hidde();
          }
        }
      );
  }

  completeExhibitors() {
    this.spinner.show();
    this.exhibitorsSubscription$ = this._exhibitorsService.exhibitors()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.exhibitors = resp.exhibitors;
            this.spinner.hidde();
          }
        }
      );
  }

  completeSponsors() {
    this.spinner.show();
    this.sponsorsSubscription$ = this._sponsorsService.sponsors()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.sponsors = resp.sponsors;
            this.spinner.hidde();
          }
        }
      );
  }

  completeEventInfo() {
    this.spinner.show();
    this.eventGlobalSubscription$ = this._eventsService.eventInfo()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.eventInfo = {...resp};
            this._countdown(new Date(resp.dateEvent));
          }
          this.spinner.hidde();
        }
      );
  }
  
  changeWorkshops(idArea:string) {
    this.spinner.show();
    this.workshopsByAreaSubscription$ = this._workshopsService.workshopsByArea(idArea)
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.areas) {
              const areas:AreaWorkshopDto = resp.areas;
              this.workshops = areas[0].workshops;
              this.messageErrorWorkshops = '';
            }
          } else {
            this.messageErrorWorkshops = resp.message;
          }
          this.spinner.hidde();
        }
      );
  }

  onWorkshopMessage(message:string) {
    this.notification.alertNotification({message});
  }

  private _countdown(dateEvent:Date): void {
    this._service.countdownTimer(dateEvent)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(resp => {
        const { days, hours, minutes, seconds, timeOut } = resp;
        
        this.dayEvent = {
          days,
          hours,
          minutes,
          seconds,
          timeOut
        };

        if(resp.timeOut) {
          this.unsubscribe$.next();
          this.unsubscribe$.complete();
        }
      });
  }
  
}
