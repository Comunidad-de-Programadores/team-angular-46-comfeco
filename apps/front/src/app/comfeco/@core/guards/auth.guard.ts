import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthUserService } from '../../../auth/@core/services/authUser.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth: AuthUserService, private route: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let auth = localStorage.getItem('auth');
    auth = !auth || auth=='false' ? sessionStorage.getItem('auth') : auth;
    
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
