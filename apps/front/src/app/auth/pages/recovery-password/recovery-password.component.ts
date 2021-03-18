import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpinnerService } from '@comfeco/api';

import { ValidateComponent } from '@comfeco/validator';
import { AuthService } from '../../@core/services/auth.service';
import { HeaderAuthService } from '../../@theme/@components/header/header.service';

@Component({
  selector: 'comfeco-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RecoveryPasswordComponent {

  recoveryPasswordForm:FormGroup = this.fb.group({
    email: [ , [ ValidateComponent.emailRequired ] ],
  });

  procesingRequest:boolean = false;
  errorResponse:string;
  errorEmail:string;

  constructor(
    private fb: FormBuilder,
    private header: HeaderAuthService,
    private spinner: SpinnerService,
    private _service: AuthService,
  ) {
    header.buttonLogin = true;
  }

  sendEmailChangePassword() {
    this._cleanErrors();

    if(this.recoveryPasswordForm.invalid) {
      this.errorEmail = this.recoveryPasswordForm.controls?.email.errors?.error;
      return;
    }
    
    this.procesingRequest = true;
    const { email } = this.recoveryPasswordForm.value;

    this.spinner.show();
    this._service.emailChangePassword(email)
      .subscribe(
        resp => {
          this.errorResponse = resp.message;
          this.procesingRequest = false;
          this.spinner.hidde();
        }
      );
  }

  private _cleanErrors() {
    this.errorEmail = '';
    this.errorResponse = '';
    this.procesingRequest = false;
  }

}
