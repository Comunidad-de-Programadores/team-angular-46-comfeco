import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthUserService } from '../../../auth/@core/services/authUser.service';
import { LogoutService } from '../../../auth/@core/services/logout.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private auth: AuthUserService,
    private logout: LogoutService,
    private route: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._validAccess();
  }
  
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this._validAccess();
  }

  private _validAccess() {
    let auth = localStorage.getItem('auth');
    auth = !auth || auth=='false' ? sessionStorage.getItem('auth') : auth;

    const dataReload:boolean = this.logout.isActiveRefreshTokenTimeout;
    
    if(auth=='true' && !dataReload) {
      this.logout.refreshToken().subscribe();
      setTimeout(() => {
        return true;
      }, 1000);
    }

    if(auth=='true') {
        return true;
    } else {
        localStorage.clear();
        sessionStorage.clear();
        this.route.navigate(['/auth/login']);
      return false;
    }
  }

}
