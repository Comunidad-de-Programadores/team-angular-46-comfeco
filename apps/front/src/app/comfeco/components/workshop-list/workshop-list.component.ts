import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { WorkshopAreaDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-workshop-list',
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopListComponent implements OnChanges {

  @Input() workshops:WorkshopAreaDto[] = [];
  @Input() message:string;
  
  @Output() onWorkshopMessage: EventEmitter<string> = new EventEmitter();

  workshopsToday:WorkshopAreaDto[] = [];
  futureWorkshops:WorkshopAreaDto[] = [];
  pastWorkshops:WorkshopAreaDto[] = [];

  ngOnChanges(changes: SimpleChanges) {
    const workshops = changes.workshops?.currentValue;
    const message = changes.message?.currentValue;

    this._cleanWorkshops();

    if(message) {
      this.message = message;
    }

    if(workshops) {
      this._classificationWorkshops(workshops);
    }
  }

  workshopMessage(message:string) {
    this.onWorkshopMessage.emit(message);
  }

  private _cleanWorkshops() {
    this.workshopsToday = [];
    this.futureWorkshops = [];
    this.pastWorkshops = [];
    this.message = '';
  }

  private _classificationWorkshops(workshops:WorkshopAreaDto[]) {
    const todayEnd = new Date();
    const todayStart = new Date();

    todayStart.setHours(0);
    todayStart.setMinutes(0);
    todayStart.setSeconds(0);
    todayEnd.setHours(23);
    todayEnd.setMinutes(59);
    todayEnd.setSeconds(59);

    workshops.forEach(
      workshop => {
        const date = new Date(workshop.endTime);

        if(date.getTime() < todayStart.getTime()) {
          this.pastWorkshops.push(workshop);
        } else if(date.getTime() < todayEnd.getTime()) {
          this.workshopsToday.push(workshop);
        } else {
          this.futureWorkshops.push(workshop);
        }
      }
    );
  }

}
