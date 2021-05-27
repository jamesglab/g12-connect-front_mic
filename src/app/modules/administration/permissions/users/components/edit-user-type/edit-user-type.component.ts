import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Response } from 'src/app/modules/auth/_models/auth.model';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminUsersService } from '../../../../_services/admin-users.service';

@Component({
  selector: 'app-edit-user-type',
  templateUrl: './edit-user-type.component.html',
  styleUrls: ['./edit-user-type.component.scss']
})
export class EditUserTypeComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public userType: any = null;
  public editUserTypeForm: FormGroup;

  public isLoading: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef,
    private _adminUserService: AdminUsersService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.editUserTypeForm = this.fb.group({
      IdTypeUser: [this.userType.idType, [Validators.required]],
      Name: [this.userType.name, [Validators.required, Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ0-9 ]+$/)]],
      Description: [this.userType.description, [Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ0-9 ]+$/)]],
      Available: [this.userType.available.toString()],
      UserModified: [null]
    });
  }

  get form() {
    return this.editUserTypeForm.controls;
  }

  onSubmit() {

    if (this.editUserTypeForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.form.UserModified.setValue(this.currentUser.idUser);
    this.form.Available.setValue((this.form.Available.value) == "true");

    const editUserTypeSubscr = this._adminUserService
      .editUserType(this.editUserTypeForm.getRawValue()).subscribe((res: Response) => {
        this.isLoading = false;
        if (res) {
          if (res.result) {
            this.showMessage(1, "¡El tipo de usuario ha sido modificado con exito!");
            this.modal.close('success');
          } else {
            this.showMessage(2, res.message[0]);
          }
        } else {
          this.showMessage(3)
        }
      }, err => { this.isLoading = false; this.showMessage(3); throw err; });
    this.unsubscribe.push(editUserTypeSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
