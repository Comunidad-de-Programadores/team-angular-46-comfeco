import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  isLogged: boolean;

  setIsLogged(user:boolean, sesion:boolean) {
    this.isLogged = user;

    if(!user) return;

    if(sesion) {
      localStorage.setItem('auth', `${user}`);
    } else {
      sessionStorage.setItem('auth', `${user}`);
    }
  }
  
}
