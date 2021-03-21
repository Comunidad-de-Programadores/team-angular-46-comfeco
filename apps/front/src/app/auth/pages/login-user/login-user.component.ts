import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SpinnerService } from '@comfeco/api';
import { ValidateComponent } from '@comfeco/validator';

import { AuthService } from '../../@core/services/auth.service';
import { HeaderAuthService } from '../../@theme/@components/header/header.service';
import { TokenDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginUserComponent implements OnInit {

  loginForm:FormGroup = this.fb.group({
    email: ['' , [ ValidateComponent.emailRequired ] ],
    password: ['' , [ ValidateComponent.passwordRequired ] ],
    sesion: new FormControl(false)
  });

  procesingRequest:boolean;
  errorResponse: string;
  errorEmail:string;
  errorPassword:string;
  Msesion = false;

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
  }

  onLogin() {
    this._cleanErrors();

    if(this.loginForm.invalid) {
      this.errorEmail = this.loginForm.controls?.email.errors?.error[0];
      this.errorPassword = this.loginForm.controls?.password.errors?.error[0];
      return;
    }

    const { email, password, sesion } = this.loginForm.value;

    this._prepareInvocation();
    this._service.login(email, password, sesion)
      .subscribe((resp:TokenDto) => this._validateLogin(resp));
  }

  loginFacebook() {
    this._prepareInvocation();

    this._service.accessFacebook()
      .subscribe((resp:TokenDto) => this._validateLogin(resp));
  }

  loginGoogle() {
    this._prepareInvocation();

    this._service.accessGoogle()
      .subscribe((resp:TokenDto) => this._validateLogin(resp));
  }

  private _prepareInvocation() {
    this._cleanErrors();
    this.procesingRequest = true;
    this.spinner.show();
  }

  private _validateLogin(resp:TokenDto) {
    if(!resp.success) {
      this.errorResponse = ( resp.code === 401
          ? 'Credenciales incorrectas'
          : resp.message);
    } else {
      this._router.navigate(['/app/dashboard']);
    }

    this.procesingRequest = false;
    this.spinner.hidde();
  }

  private _cleanErrors() {
    this.errorEmail = '';
    this.errorPassword = '';
    this.errorResponse = '';
    this.procesingRequest = false;
  }

}
