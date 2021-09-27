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

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  private currentUser: UserModel = this._storageService.getItem("user");

  public changePasswordForm: FormGroup;
  private unsubscribe: Subscription[] = [];

  constructor(private _storageService: StorageService, private _userService: UserService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { setTimeout(() => {this.buildForm();}) }

  buildForm() {
    this.changePasswordForm = this.fb.group({
      idUser: [this.currentUser?.idUser, Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    },
      {
        validators: [MustMatch('newPassword', 'confirmNewPassword')]
      }
    );
    this.cdr.detectChanges();
  }

  get form() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.setDefaultValues();
    if (this.changePasswordForm.invalid) {
      return;
    }
    // console.log("Se fue", this.changePasswordForm.getRawValue())
    this.changePassword();
  }

  setDefaultValues(){
    this.form.idUser.setValue(this.currentUser.idUser);
  }

  changePassword() {
    const changePassSubscr = this._userService.changePassword(this.changePasswordForm.getRawValue())
      .subscribe((res: Response) => {
        if (res) {
          if (res.result) {
            this.showMessage(1, "!Tu contraseña ha sido actualizada con exito¡");
            this.modal.close("success");
          } else {
            this.showMessage(res.notificationType, res.message[0])
          }
        } else {
          this.showMessage(3);
        }
      })
    this.unsubscribe.push(changePassSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

}
