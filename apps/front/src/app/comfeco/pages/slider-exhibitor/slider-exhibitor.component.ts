import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ExhibitorDto } from '@comfeco/interfaces';

import SwiperCore, { Navigation, Pagination, Autoplay, Virtual } from "swiper/core";

SwiperCore.use([
  Navigation,
  Pagination,
  Autoplay,
  Virtual
]);

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
