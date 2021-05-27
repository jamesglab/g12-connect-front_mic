import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { numberOnly } from 'src/app/_helpers/tools/validators.tool';

import { MainService } from '../../_services/main.service';
import { AuthService } from '../_services/auth.service';

import { Response } from '../_models/auth.model';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm: FormGroup;
  public errorState: ErrorStates = ErrorStates.NotSubmitted;
  public errorStates = ErrorStates;
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
    this.getDocumentTypes();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      documentType: [null,
        Validators.compose([
          Validators.required
        ])
      ],
      documentNumber: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6)
        ])
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
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

  getDocumentTypes() {
    this._mainService
      .getDocumentTypes().subscribe((res: Response) => {
        if (res.result) {
          this.documentTypes = res.entity;
          this.cdr.detectChanges();
        } else {
        }
      });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    if(this.forgotPasswordForm.invalid){
      return;
    }
    this.parseAttrToInsert();
    //this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
    const forgotPassSubscr = this.authService.forgotPassword(this.forgotPasswordForm.getRawValue())
    .subscribe((res: Response) => {
      if (res) {
        // console.log("THE RESPONSE", res)
        if (res.result) {
          // this.errorState = ErrorStates.NoError;
          this.errorState = ErrorStates.NoError;
          // console.log("SUCCESS",res.message[0])
          // this.showMessage(1, "!Tu contraseña ha sido actualizada con exito¡");
        } else {
          this.errorState = ErrorStates.HasError;
          this.errorMessage = res.message[0];
          // this.showMessage(res.notificationType, res.message[0])
        }
      } else {
        this.errorState = ErrorStates.HasError;
        this.errorMessage = "Hemos tenido problemas en nuestro servidor, intentalo nuevamente."
        // this.showMessage(3);
      }
    })
  this.unsubscribe.push(forgotPassSubscr);
  }

  parseAttrToInsert(){
    this.form.documentType.setValue(parseInt(this.form.documentType.value));
  }

  // showMessage(type: number, message?: string) {
  //   this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  // }

}
