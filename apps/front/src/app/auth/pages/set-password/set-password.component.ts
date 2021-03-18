import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ValidateComponent } from '@comfeco/validator';

import { AuthService } from '../../@core/services/auth.service';
import { HeaderAuthService } from '../../@theme/@components/header/header.service';
import { SpinnerService } from '@comfeco/api';

@Component({
  selector: 'comfeco-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SetPasswordComponent implements OnInit, OnDestroy {

  setPasswordForm:FormGroup = this.fb.group({
    password: [ , [ ValidateComponent.passwordRequired ] ],
    confirm: [ , [ ValidateComponent.matchPasswords('password') ] ],
  });

  subscriptionMatchValues$:Subscription;

  procesingRequest:boolean = false;
  errorResponse:string;
  errorPassword:string;
  errorConfirm:string;

  token:string;

  constructor(
    private fb: FormBuilder,
    private header: HeaderAuthService,
    private spinner: SpinnerService,
    private activatedRoute: ActivatedRoute,
    private _service: AuthService,
    private _router: Router,
  ) {
    header.buttonLogin = true;
  }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');

    this.subscriptionMatchValues$ = ValidateComponent.subscriptionMatchValues(this.setPasswordForm, 'password', 'confirm');
  }

  ngOnDestroy(): void {
    this.subscriptionMatchValues$.unsubscribe();
  }

  renewPassword() {
    this._cleanErrors();

    if(this.setPasswordForm.invalid) {
      this.errorPassword = this.setPasswordForm.controls?.password.errors?.error[0];
      this.errorConfirm = this.setPasswordForm.controls?.confirm.errors?.error;
      return;
    }

    this.procesingRequest = true;
    const { password } = this.setPasswordForm.value;

    this.spinner.show();
    this._service.changePassword(password, this.token)
      .subscribe(
        resp => {
          this.errorResponse = resp.message;
          this.procesingRequest = false;
          this.spinner.hidde();
        }
      );
  }

  private _cleanErrors() {
    this.errorResponse = '';
    this.errorPassword = '';
    this.errorConfirm = '';
    this.procesingRequest = false;
  }

}
