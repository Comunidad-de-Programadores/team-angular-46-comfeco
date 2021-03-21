/* eslint-disable @angular-eslint/no-host-metadata-property */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewEncapsulation, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MenuDto } from '@comfeco/interfaces';

import { LayoutComfecoService } from '../../layout/layout-comfeco.service';
import { HeaderService } from './header.service';
import { LogoutService } from '../../../../auth/@core/services/logout.service';
import { SpinnerService } from '@comfeco/api';

@Component({
  selector: 'comfeco-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements OnInit, OnDestroy {
  photoDefault = 'assets/img/avatar_user.svg';
  photoUrl:string;

  showMenu = false;
  showProfileOptions = false;

  options:MenuDto[] = [];

  private photoUrlRef$:Subscription = null;

  constructor(
    private _router: Router,
    private _domref: ElementRef,
    private spinner: SpinnerService,
    public service: HeaderService,
    private _serviceLogout: LogoutService,
    private notification: LayoutComfecoService,
  ) {}

  onClickOutside(event) {
    if (!this._domref.nativeElement.contains(event.target)) {
      this.showProfileOptions = false;
    }
  }

  ngOnInit(): void {
    this.photoUrl = this.photoDefault;
    this.photoUrlRef$ = this.service.photoUrl$.subscribe(resp => {
      const photoRef:any = document.getElementById('user-photo-profile');
      const photoNew:string = resp ? resp : this.photoDefault;
      photoRef.setAttribute('src', photoNew);
      this.photoUrl = photoNew;
    });

    this.spinner.show();
    this.service.optionsMenu()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.options = resp.options;
          } else {
            this.notification.alertNotification({message: resp.message});
          }

          this.spinner.hidde();
        }
      );

    this.spinner.show();
    this.service.user()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            const { user, photoUrl } = resp;
            this.service.changeUser(user);
            this.service.changePhoto(photoUrl);
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

  ngOnDestroy(): void {
    this.photoUrlRef$.unsubscribe();
  }

  toggleProfileOptions() {
    this.showProfileOptions = !this.showProfileOptions;
  }

  toggleMenu(showMenu:boolean) {
    this.showMenu = showMenu;
  }

  logout() {
    this.spinner.show();
    this._serviceLogout.logout().subscribe(_ => {
      this._router.navigate(['/auth/login']);
      this.spinner.hidde();
    });
    this.toggleProfileOptions();
  }

  myProfile() {
    this.spinner.show();
    this._router.navigateByUrl('/app/my-profile');
    this.toggleProfileOptions();
    this.spinner.hidde();
  }

}
