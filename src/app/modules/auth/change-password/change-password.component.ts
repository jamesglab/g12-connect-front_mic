import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { numberOnly } from 'src/app/_helpers/tools/validators.tool';

import { MainService } from '../../_services/main.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated

})
export class ChangePasswordComponent implements OnInit {

  public forgotPasswordForm: FormGroup;
  public errorMessage: String = "";
  public isLoading$: Observable<boolean>;

  public documentTypes: any[] = [];
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder, private _mainService: MainService,
    private authService: AuthService, private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]),

      ],
    });
  }

  get form(){
    return this.forgotPasswordForm.controls;
  }

  numberOnly(event): boolean {
    return numberOnly(event);
  }
  submit(){
    
  }

}
