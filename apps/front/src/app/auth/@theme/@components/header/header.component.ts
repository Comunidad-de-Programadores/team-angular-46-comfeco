import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderAuthService } from './header.service';

@Component({
  selector: 'comfeco-auth-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent {

  constructor(public service:HeaderAuthService) {}

}
