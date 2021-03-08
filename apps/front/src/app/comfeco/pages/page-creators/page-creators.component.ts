import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ExhibitorDto, ExhibitorsDto } from '@comfeco/interfaces';
import { PageCreatorsService } from './page-creators.service';

@Component({
  selector: 'comfeco-page-creators',
  templateUrl: './page-creators.component.html',
  styleUrls: ['./page-creators.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageCreatorsComponent implements OnInit {

  creators:ExhibitorDto[] = [];
  
  messageErrorCreators:string;

  constructor(private _service: PageCreatorsService) { }

  ngOnInit(): void {
    this._service.exhibitors()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.exhibitors) {
              this.creators = resp.exhibitors;
            }
          } else {
            this.messageErrorCreators = resp.message;
          }
        }
      );
  }

}
