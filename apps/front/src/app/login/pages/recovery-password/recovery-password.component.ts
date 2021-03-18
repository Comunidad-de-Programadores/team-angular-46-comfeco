import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ValidateComponent } from '@comfeco/validator';
import { AuthService } from '../../@core/services/auth.service';

@Component({
  selector: 'comfeco-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RecoveryPasswordComponent {

  recoveryPasswordForm:FormGroup = this.fb.group({
    email: [ , [ ValidateComponent.email ] ],
  });

  procesingRequest:boolean = false;
  errorResponse:string;
  errorEmail:string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _service: AuthService ) { }

  sendEmailChangePassword() {
    this.cleanErrors();

    if(this.recoveryPasswordForm.invalid) {
      this.errorEmail = this.recoveryPasswordForm.controls?.email.errors?.error;
      return;
    }
    
    this.procesingRequest = true;
    const { email } = this.recoveryPasswordForm.value;

    this._service.emailChangePassword(email)
      .subscribe(
        resp => {
          this.errorResponse = resp.message;
          this.procesingRequest = false;

          if(resp.success) {
            this.router.navigateByUrl('/login/login');
          }
        }
      );
  }

  cleanErrors() {
    this.errorEmail = '';
    this.errorResponse = '';
    this.procesingRequest = false;
  }

}
