import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe, Observable, of, from } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

import { ChangePasswordDto, RecoverAccountDto, ResponseService, GenericResponse, RegisterDto, TokenDto, GoogleLoginDto, FacebookLoginDto, LoginDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

import { AuthUserService } from './authUser.service';
import { LogoutService } from './logout.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlAuth:string = '/auth';

  socialUser: SocialUser;
  userLogged: SocialUser;
  isLogged: boolean;
  public user: any;

  constructor(
    private http: HttpClient,
    private authService: SocialAuthService,
    private authuser: AuthUserService,
    private _logoutService: LogoutService,
  ) {}

  register(user, email, password) {
    const url:string = `${this.urlAuth}/register`;
    const registerUser:RegisterDto = { user, email, password, terms:true };

    return this.http.post<TokenDto>(url, registerUser)
      .pipe(this._evaluationRecord(false));
  }

  login(email, password, session) {
    const url:string = `${this.urlAuth}/login`;
    const loginUser:LoginDto = {  email, password };

    this.user = this.http.post<TokenDto>(url, loginUser)
      .pipe(this._evaluationRecord(session));

    return this.user;
  }

  public accessGoogle() {
    const url:string = `${this.urlAuth}/google/verify`;

    return from(this.authService.signIn(GoogleLoginProvider.PROVIDER_ID))
      .pipe(
        catchError(error => of({ error, success: false })),
        switchMap((data:any) => {
          const {id, firstName, lastName, email, photoUrl, authToken, provider, idToken} = data;
          const google:GoogleLoginDto = {
            id, firstName, lastName, email, photoUrl, authToken, provider, idToken
          };

          return this.http.post(url, google);
        }),
        this._evaluationRecord(true)
      );
  }

  public accessFacebook() {
    const url:string = `${this.urlAuth}/facebook/verify`;

    return from(this.authService.signIn(FacebookLoginProvider.PROVIDER_ID))
      .pipe(
        catchError(error => of({ error, success: false })),
        switchMap((data:any) => {
          const {id, firstName, lastName, email, photoUrl, authToken, provider} = data;
          const facebook:FacebookLoginDto = {
            id, firstName, lastName, email, photoUrl, authToken, provider
          };

          return this.http.post(url, facebook);
        }),
        this._evaluationRecord(true)
      );
  }

  emailChangePassword(email:string): Observable<ResponseService> {
    const url:string = `${this.urlAuth}/recover_user_account`;
    const recover:RecoverAccountDto = { email };

    return this.http.patch<GenericResponse>(url, recover).pipe(ValidatorService.changeBasicResponse());
  }

  changePassword(password:string, token:string): Observable<ResponseService> {
    const url:string = `${this.urlAuth}/change_password`;
    const change:ChangePasswordDto = { password, token };

    return this.http.put<GenericResponse>(url, change).pipe(ValidatorService.changeBasicResponse());
  }

  private _evaluationRecord(check:boolean) {
    return pipe(
      ValidatorService.changeErrorAuthResponse(),
      tap(response=> {
        this.authuser.setIsLogged(response.success, check);

        if(response.success) {
          this._logoutService.startRefreshTokenTimer();
        }
      })
    );
  }

}
