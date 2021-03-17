import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

import { ChangePasswordDto, RecoverAccountDto, ResponseService, GenericResponse, RegisterDto, TokenDto, GoogleLoginDto, FacebookLoginDto, LoginDto } from '@comfeco/interfaces';

import { environment } from '../../../../environments/environment';
import { ValidatorService } from '@comfeco/validator';
import { AuthUserService } from './authUser.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlAuth:string = `/auth`;
  socialUser: SocialUser;
  userLogged: SocialUser;
  isLogged: boolean;
  public user: any;
  constructor(
    private http: HttpClient,
    private authService: SocialAuthService,
    private authuser: AuthUserService
  ) { }

  register(user, email, password) {
    const url:string = `${this.urlAuth}/register`;
    const registerUser:RegisterDto = { user, email, password, terms:true };

    return this.http.post<TokenDto | GenericResponse>(url, registerUser).pipe(ValidatorService.changeErrorAuthResponse());
  }

  login(email, password, sesion){
    const url:string = `${this.urlAuth}/login`;
    const loginUser:LoginDto = {  email, password };

     this.user =  this.http.post<TokenDto | GenericResponse>(url, loginUser).pipe(ValidatorService.changeErrorAuthResponse(), tap(
       (res: TokenDto) =>{
         if(sesion === true){
          if(res.code === 200){
            this.authuser.setIsLogget(true);
            localStorage.getItem('auth');
            // localStorage.setItem('auth2', `${true}`);
          }
          else{
           this.authuser.setIsLogget(false);
          }
         }
         else{
          if(res.code === 200){
            this.authuser.setIsLogget(true);
            this.user.pipe( map( userr => {
              console.log(userr);
            }))

          }
          else{
           this.authuser.setIsLogget(false);
          }
         }
       }
     ));

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
        ValidatorService.changeErrorAuthResponse()
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
        ValidatorService.changeErrorAuthResponse()
      );
  }

  logout() {
    const url:string = `${this.urlAuth}/logout`;

    return this.http.get<GenericResponse>(url).pipe(ValidatorService.changeBasicResponse());
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

}
