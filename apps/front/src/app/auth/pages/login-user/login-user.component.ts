import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, } from "@angular/forms";
import { Router } from '@angular/router';

import { SpinnerService } from '@comfeco/api';

import { AuthService } from '../../@core/services/auth.service';
import { HeaderAuthService } from '../../@theme/@components/header/header.service';

@Component({
  selector: 'comfeco-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginUserComponent implements OnInit {

  loginForm =  new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    sesion: new FormControl(false)
  });

  procesingRequest:boolean;
  errorResponse: string;
  errorUser:string;
  errorEmail:string;
  errorPassword:string;
  errorConfirm:string;
  Msesion = false;

  constructor(
    private _service: AuthService,
    private header: HeaderAuthService,
    private spinner: SpinnerService,
    private router: Router
  ) {
    header.buttonLogin = false;
  }

  ngOnInit(): void {
    this.procesingRequest = false;
  }

  async onlogin() {
    const { email, password, sesion } = this.loginForm.value;
    this.procesingRequest = true;
    this.spinner.show();
    this._service.login(email, password, sesion)
      .subscribe((resp:any) => {
        if(resp.code != 200){
          this.errorResponse = resp.message;
        } else {
          this.errorResponse = 'Usuario correcto Ingresando';
          this.router.navigate(['/app/dashboard']);
        }
        this.procesingRequest = false;
        this.spinner.hidde();
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
          this.router.navigate(['/app/dashboard']);
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
        if(!resp.success) {
          this.errorResponse = resp.message;
        } else {
          this.router.navigate(['/app/dashboard']);
          this.errorResponse = 'Usuario registrado exitosamente';
        }

        this.procesingRequest = false;
      });
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
