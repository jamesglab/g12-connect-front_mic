import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { numberOnly } from 'src/app/_helpers/tools/validators.tool';

import { MainService } from '../../_services/main.service';
import { AuthService } from '../_services/auth.service';

import { environment } from 'src/environments/environment';

import { Response } from '../_models/auth.model';
import Swal from 'sweetalert2';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;
  public errorState: ErrorStates = ErrorStates.NotSubmitted;
  public errorStates = ErrorStates;
  public errorMessage: String = '';
  public isLoading$: Observable<boolean>;

  public documentTypes: any[] = [];
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private _mainService: MainService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
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

  get form() {
    return this.forgotPasswordForm.controls;
  }

  numberOnly(event): boolean {
    return numberOnly(event);
  }

  submit() {
    // this.errorState = ErrorStates.NotSubmitted;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    // this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
    const forgotPassSubscr = this.authService
      .forgotPassword({
        email: this.forgotPasswordForm.getRawValue().email,
        url: environment.url_change_password,
      })
      .subscribe(
        (res: any) => {
          if (res) {
            Swal.fire(
              'Correo Enviado',
              'Solicitud enviada el correo',
              'success'
            );
          } else {
            this.errorState = ErrorStates.HasError;
            this.errorMessage =
              'Hemos tenido problemas en nuestro servidor, intentalo nuevamente.';
            // this.showMessage(3);
          }
        },
        (err) => {
          console.log('trenemos error', err);
          Swal.fire('Error', 'No pudimos enviar el correo', 'error');
        }
      );
    this.unsubscribe.push(forgotPassSubscr);
  }

  parseAttrToInsert() {
    this.form.documentType.setValue(parseInt(this.form.documentType.value));
  }

  // showMessage(type: number, message?: string) {
  //   this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  // }
}
