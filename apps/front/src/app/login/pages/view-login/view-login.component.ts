import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../../@core/services/auth.service';
@Component({
  selector: 'comfeco-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ViewLoginComponent implements OnInit {

  loginForm =  new FormGroup({
    email: new FormControl(''),
    password: new FormControl("")
  });

  procesingRequest:boolean;
  errorResponse: string;
  errorUser:string;
  errorEmail:string;
  errorPassword:string;
  errorConfirm:string;
  constructor( private _service: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.procesingRequest = false;
  }

  async  onlogin(){
    const { email, password,  } = this.loginForm.value;
    console.log('email', email, password)
    this.procesingRequest = true;
    this._service.login(email, password)
      .subscribe((resp:any) => {
        if(!resp.success) {
          this.errorResponse = resp.message;
        } else {
          this.errorResponse = 'Usuario correcto Ingresando';
          this.router.navigate(['/app/dashboard']);
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

cleanErrors() {
  this.errorUser = '';
  this.errorEmail = '';
  this.errorPassword = '';
  this.errorConfirm = '';
  this.errorResponse = '';
  this.procesingRequest = false;
}

}
