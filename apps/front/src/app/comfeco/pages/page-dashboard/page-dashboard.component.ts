import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subject } from "rxjs";

import { AreaWorkshopDto, ComboInterface, CommunityDto, DayEvent, EventDto, ExhibitorDto, KnowledgeAreaDto, SponsorDto, WorkshopAreaDto } from '@comfeco/interfaces';

import { DashboardService } from './page-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { SpinnerService } from '@comfeco/api';

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

  unsubscribe$ = new Subject<void>();

  constructor(
    private _service: DashboardService,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this._service.communities()
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

    this.spinner.show();
    this._service.knowledgeArea()
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

      this.spinner.show();
      this._service.exhibitors()
        .subscribe(
          (resp:any) => {
            if(resp.success) {
              this.exhibitors = resp.exhibitors;
              this.spinner.hidde();
            }
          }
        );

    this.spinner.show();
    this._service.sponsors()
        .subscribe(
          (resp:any) => {
            if(resp.success) {
              console.log(resp)
              this.sponsors = resp.sponsors;
              this.spinner.hidde();
            }
          }
        );

    this.spinner.show();
    this._service.eventInfo()
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeWorkshops(idArea:string) {
    this.spinner.show();
    this._service.workshops(idArea)
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
