import { Injectable } from '@angular/core';

const TOKEN_KEY = 'TokenAuthentication';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  get token(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  set token(token: string) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

}