import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  isLogged: boolean;

  setIsLogget(user: boolean) {
    this.isLogged = user;
    localStorage.setItem('auth', `${user}`);
  }
  
}
