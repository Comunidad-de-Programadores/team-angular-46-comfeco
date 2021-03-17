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

  constructor( private _service: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.procesingRequest = false;
  }

  async  onlogin(){
    const { email, password, sesion } = this.loginForm.value;
    console.log('email', email, password, sesion)
    this.procesingRequest = true;
    this._service.login(email, password, sesion)
      .subscribe((resp:any) => {

        console.log('respuesta',resp)
        if(resp.code != 200){
          this.errorResponse = resp.message;
        } else {
          this.errorResponse = 'Usuario correcto Ingresando';
          this.router.navigate(['/app/dashboard']);
        }
        this.procesingRequest = false;
    },(err)=>{console.log(err)});
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
      console.log(resp)
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
