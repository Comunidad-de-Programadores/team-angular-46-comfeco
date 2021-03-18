import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SpinnerService } from '@comfeco/api';
import { AreaWorkshopDto } from '@comfeco/interfaces';
import { PageWorkshopsService } from './page-workshops.service';

@Component({
  selector: 'comfeco-page-workshops',
  templateUrl: './page-workshops.component.html',
  styleUrls: ['./page-workshops.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageWorkshopsComponent implements OnInit {

  workshopsArea:AreaWorkshopDto[] = [];
  
  messageErrorWorkshops:string;

  constructor(
    private _service: PageWorkshopsService,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this._service.workshops()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.areas) {
              this.workshopsArea = resp.areas;
            }
          } else {
            this.messageErrorWorkshops = resp.message;
          }
          this.spinner.hidde();
        }
      );
  }

}
