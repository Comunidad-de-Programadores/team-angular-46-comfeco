import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper/core";

import { ExhibitorDto } from '@comfeco/interfaces';

SwiperCore.use([ Navigation, Pagination, Autoplay ]);

@Component({
  selector: 'comfeco-slider-exhibitor',
  templateUrl: './slider-exhibitor.component.html',
  styleUrls: ['./slider-exhibitor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderExhibitorComponent {

  @Input() exhibitors:ExhibitorDto[];

  breakpoints = {
    640: { slidesPerView: 3, spaceBetween: 40 },
    768: { slidesPerView: 2, spaceBetween: 0 },
    1024: { slidesPerView: 4, spaceBetween: 40 }
  };

}
