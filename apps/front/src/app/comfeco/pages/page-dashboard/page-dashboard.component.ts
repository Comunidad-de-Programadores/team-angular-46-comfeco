import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subject } from "rxjs";

import { AreaWorkshopDto, ComboInterface, CommunityDto, DayEvent, EventDto, KnowledgeAreaDto, WorkshopAreaDto } from '@comfeco/interfaces';

import { DashboardService } from './page-dashboard.service';
import { takeUntil } from 'rxjs/operators';

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
  eventInfo:EventDto;
  dayEvent:DayEvent;

  messageErrorCommunities:string;
  messageErrorWorkshops:string;

  unsubscribe$ = new Subject<void>();

  constructor(private _service: DashboardService) { }

  ngOnInit(): void {
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
        }
      );

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
          }
        }
      );

    this._service.eventInfo()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.eventInfo = {...resp};
            this._countdown(new Date(resp.dateEvent));
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeWorkshops(idArea:string) {
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
