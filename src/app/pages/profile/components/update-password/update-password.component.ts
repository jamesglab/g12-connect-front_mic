import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MustMatch } from 'src/app/_helpers/tools/validators.tool';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { StorageService } from '../../../../modules/auth/_services/storage.service';
import { UserService } from '../../../../modules/_services/user.service';

import { Response } from '../../../../modules/auth/_models/auth.model';
import { UserModel } from '../../../../modules/auth/_models/user.model';
import { CdkNoDataRow } from '@angular/cdk/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  private currentUser = null;

  public changePasswordForm: FormGroup;
  private unsubscribe: Subscription[] = [];
  public isLoading = false;

  constructor(
    private _userService: UserService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.changePasswordForm = this.fb.group(
      {
        idUser: [null, Validators.required],
        newPassword: [null, Validators.required],
        confirmNewPassword: [null, Validators.required],
      },
      {
        validators: [MustMatch('newPassword', 'confirmNewPassword')],
      }
    );
    this.cdr.detectChanges();
  }

  get form() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.changePasswordForm.controls.idUser.setValue(this.currentUser.id);
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.changePassword();
  }

  setDefaultValues() {
    this.form.idUser.setValue(this.currentUser.idUser);
  }

  changePassword() {
    this.isLoading = true;
    const changePassSubscr = this._userService
      .updateProfile({
        id: this.changePasswordForm.getRawValue().idUser,
        password: this.changePasswordForm.getRawValue().confirmNewPassword,
      })
      .subscribe(
        (res: Response) => {
          if (res) {
            Swal.fire(
              'Datos Actualizados',
              'La contraseña se ha actualizado correctamente',
              'success'
            );
            this.isLoading = false;
            this.changePasswordForm.reset();
            this.modal.close();
            this.cdr.detectChanges();
          }
        },
        (err) => {
          this.isLoading = false;
          Swal.fire(
            'No se pudo actualizar',
            'Por favor vuelva a intentar',
            'error'
          );
        }
      );
    this.unsubscribe.push(changePassSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(
      NotificationComponent,
      notificationConfig(type, message)
    );
  }
}
