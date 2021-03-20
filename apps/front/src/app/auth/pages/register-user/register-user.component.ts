import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';

import { ValidateComponent } from '@comfeco/validator';

import { AuthService } from '../../@core/services/auth.service';
import { HeaderAuthService } from '../../@theme/@components/header/header.service';
import { SpinnerService } from '@comfeco/api';
import { TokenDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RegisterUserComponent implements OnInit, OnDestroy {

  registerForm:FormGroup = this.fb.group({
    user: [ , [ ValidateComponent.user ] ],
    email: [ , [ ValidateComponent.emailRequired ] ],
    password: [ , [ ValidateComponent.passwordRequired ] ],
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
    private header: HeaderAuthService,
    private spinner: SpinnerService,
    private _service: AuthService,
    private _router: Router
  ) {
    header.buttonLogin = false;
  }

  ngOnInit(): void {
    this.procesingRequest = false;

    this.subscriptionMatchValues$ = ValidateComponent.subscriptionMatchValues(this.registerForm, 'password', 'confirm');
  }

  ngOnDestroy(): void {
    this.subscriptionMatchValues$.unsubscribe();
  }

  onRegister() {
    this._cleanErrors();

    if(this.registerForm.invalid) {
      this.errorUser = this.registerForm.controls?.user.errors?.error[0];
      this.errorEmail = this.registerForm.controls?.email.errors?.error[0];
      this.errorPassword = this.registerForm.controls?.password.errors?.error[0];
      this.errorConfirm = this.registerForm.controls?.confirm.errors?.error;
      return;
    }

    const { user, email, password } = this.registerForm.value;

    this._prepareInvocation();

    this._service.register(user, email, password)
      .subscribe((resp:TokenDto) => this._validateRegister(resp));
  }

  registerFacebook() {
    this._prepareInvocation();

    this._service.accessFacebook()
      .subscribe((resp:TokenDto) => this._validateRegister(resp));
  }

  registerGoogle() {
    this._prepareInvocation();

    this._service.accessGoogle()
      .subscribe((resp:TokenDto) => this._validateRegister(resp));
  }

  private _prepareInvocation() {
    this._cleanErrors();
    this.procesingRequest = true;
    this.spinner.show();
  }

  private _validateRegister(resp:TokenDto) {
    if(!resp.success) {
      this.errorResponse = resp.code==401
          ? 'Credenciales incorrectas'
          : resp.message;
    } else {
      this._router.navigate(['/app/dashboard']);
    }

    this.procesingRequest = false;
    this.spinner.hidde();
  }

  private _cleanErrors() {
    this.errorUser = '';
    this.errorEmail = '';
    this.errorPassword = '';
    this.errorConfirm = '';
    this.errorResponse = '';
    this.procesingRequest = false;
  }

}
