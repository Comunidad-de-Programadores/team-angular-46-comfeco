import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ValidateComponent } from '@comfeco/validator';

import { AuthService } from '../../@core/services/auth.service';
import { HeaderAuthService } from '../../@theme/@components/header/header.service';

@Component({
  selector: 'comfeco-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SetPasswordComponent implements OnInit, OnDestroy {

  setPasswordForm:FormGroup = this.fb.group({
    password: [ , [ ValidateComponent.password ] ],
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _service: AuthService
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
    this.cleanErrors();

    if(this.setPasswordForm.invalid) {
      this.errorPassword = this.setPasswordForm.controls?.password.errors?.error[0];
      this.errorConfirm = this.setPasswordForm.controls?.confirm.errors?.error;
      return;
    }

    this.procesingRequest = true;
    const { password } = this.setPasswordForm.value;

    this._service.changePassword(password, this.token)
      .subscribe(
        resp => {
          this.errorResponse = resp.message;
          this.procesingRequest = false;

          if(resp.success) {
            this.router.navigateByUrl('/auth/login');
          }
        }
      );
  }

  cleanErrors() {
    this.errorResponse = '';
    this.errorPassword = '';
    this.errorConfirm = '';
    this.procesingRequest = false;
  }

}
