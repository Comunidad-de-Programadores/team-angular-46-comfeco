import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { SponsorDto } from '@comfeco/interfaces';

import SwiperCore, { Navigation, Pagination } from "swiper/core";

SwiperCore.use([ Navigation, Pagination ]);

@Component({
  selector: 'comfeco-slider-sponsor',
  templateUrl: './slider-sponsor.component.html',
  styleUrls: ['./slider-sponsor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderSponsorComponent {

  @Input() sponsors:SponsorDto[];

  breakpoints = {
    640: { slidesPerView: 8, spaceBetween: 0 },
    768: { slidesPerView: 3, spaceBetween: 0 },
    1024: { slidesPerView: 6, spaceBetween: 0 }
  };

}
