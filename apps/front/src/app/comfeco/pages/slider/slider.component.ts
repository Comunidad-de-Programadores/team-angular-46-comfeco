import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ExhibitorDto } from '@comfeco/interfaces';

import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper/core';
import { PageCreatorsService } from '../page-creators/page-creators.service';

 SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'comfeco-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SliderComponent implements OnInit {

  creators:ExhibitorDto[] = [];

  messageErrorCreators:string;
  constructor( private _service: PageCreatorsService) { }

  ngOnInit(): void {

    this._service.exhibitors()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.exhibitors) {
              this.creators = resp.exhibitors;
              console.log(this.creators)
            }
          } else {
            this.messageErrorCreators = resp.message;
          }
        }
      );
  }

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}
