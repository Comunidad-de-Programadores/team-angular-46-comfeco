import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper/core';

 SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'comfeco-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SponsorComponent implements OnInit{

  constructor() { }

  ngOnInit(): void {
  }

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}
