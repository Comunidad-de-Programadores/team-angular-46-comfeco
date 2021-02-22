import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidateComponent } from '@comfeco/validator';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';

import { AuthService } from '../../@core/services/auth.service';

@Component({
  selector: 'comfeco-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RegisterUserComponent implements OnInit, OnDestroy {

  registerForm:FormGroup = this.fb.group({
    user: [ , [ ValidateComponent.user ] ],
    email: [ , [ ValidateComponent.email ] ],
    password: [ , [ ValidateComponent.password ] ],
    confirm: [ , [ ValidateComponent.matchPasswords('password') ] ],
  });

  subscriptionMatchValues$:Subscription;

  procesingRequest:boolean;
  errorResponse:string;
  errorUser:string;
  errorEmail:string;
  errorPassword:string;
  errorConfirm:string;

  user: SocialUser;
  loggedIn: boolean;
  
  constructor(
    private fb: FormBuilder,
    private authService: SocialAuthService,
    private _service: AuthService ) { }

    suscriber$:Subscription;

  ngOnInit(): void {
    this.procesingRequest = false;

    this.suscriber$ = this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    this.subscriptionMatchValues$ = ValidateComponent.subscriptionMatchValues(this.registerForm, 'password', 'confirm');
  }

  ngOnDestroy(): void {
    this.suscriber$.unsubscribe();
    this.subscriptionMatchValues$.unsubscribe();
  }

  register() {
    this.cleanErrors();

    if(this.registerForm.invalid) {
      console.log(this.registerForm);
      this.errorUser = this.registerForm.controls?.user.errors?.error[0];
      this.errorEmail = this.registerForm.controls?.email.errors?.error[0];
      this.errorPassword = this.registerForm.controls?.password.errors?.error[0];
      this.errorConfirm = this.registerForm.controls?.confirm.errors?.error;
      return;
    }

    this.procesingRequest = true;
    const { user, email, password } = this.registerForm.value;

    this._service.register(user, email, password)
      .subscribe((resp:any) => {
        if(!resp.success) {
          this.errorResponse = resp.message;
        } else {
          this.errorResponse = 'Usuario registrado exitosamente';
        }
        
        this.procesingRequest = false;
      });
  }

  registerFacebook() {
    this.cleanErrors();
    this.procesingRequest = true;
    this._service.accessFacebook()
      .subscribe((resp:any) => {
        if(!resp.success) {
          this.errorResponse = resp.message;
        } else {
          this.errorResponse = 'Usuario registrado exitosamente';
        }
        
        this.procesingRequest = false;
      });
  }

  registerGoogle() {
    this.cleanErrors();
    this.procesingRequest = true;
    this._service.accessGoogle()
      .subscribe((resp:any) => {
        console.log(resp)
        if(!resp.success) {
          this.errorResponse = resp.message;
        } else {
          this.errorResponse = 'Usuario registrado exitosamente';
        }
        
        this.procesingRequest = false;
      });
  }

  logout() {
    this._service.logout()
      .subscribe(
        resp => {
          console.log('logout', resp);
        }
      );
  }

  cleanErrors() {
    this.errorUser = '';
    this.errorEmail = '';
    this.errorPassword = '';
    this.errorConfirm = '';
    this.errorResponse = '';
    this.procesingRequest = false;
  }

}
