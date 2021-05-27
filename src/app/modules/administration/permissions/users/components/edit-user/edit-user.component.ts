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
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public user: any = null;
  public editUserForm: FormGroup;
  public userTypes: any[] = [];

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef, private _storageService: StorageService,
    private _adminUserService: AdminUsersService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getUserTypes();
  }

  buildForm() {
    this.editUserForm = this.fb.group({
      IdUser: [this.user.idUser],
      Names: [{ value: this.user.name, disabled: true }], //FOR RENDER
      SurNames: [{ value: this.user.lastName, disabled: true }], // FOR RENDER
      Type: [{ value: null, disabled: true }], // FOR RENDER
      TypeUser: [this.user.idTypeuser.toString(), [Validators.required]],
      Nickname: [this.user.nickName, [Validators.required, Validators.email]],
      Available: [this.user.disposable.toString()],
      UserModified: [null],
    });
  }

  get form() {
    return this.editUserForm.controls;
  }

  getUserTypes() {
    const getUserTypesSubscr = this._adminUserService
      .getUserTypes().subscribe((res: Response) => {
        if (res.result) {
          this.userTypes = res.entity;
          this.setUserType();
          this.cdr.detectChanges();
        }
      }, err => { throw err; });
    this.unsubscribe.push(getUserTypesSubscr);
  }

  setUserType(){
    this.userTypes.map(type => {
      if(parseInt(this.form.TypeUser.value) == type.idType){
        this.form.Type.setValue(type.name);
      }
    })
  }

  onSubmit() {

    if (this.editUserForm.invalid) {
      return
    }

    this.form.UserModified.setValue(this.currentUser.idUser);
    this.form.TypeUser.setValue(parseInt(this.form.TypeUser.value));
    this.form.Available.setValue((this.form.Available.value) == "true");

    const editUserSubscr = this._adminUserService
      .editUser(this.editUserForm.getRawValue()).subscribe((res: Response) => {
        if(res){
          if(res.result){
            this.showMessage(1,"¡El usuario ha sido modificado correctamente!");
            this.modal.close('success');
          }else{
            this.showMessage(2, res.message[0]);
          }
        }else{
          this.showMessage(3)
        }
      }, err => { this.showMessage(3); throw err;});
    this.unsubscribe.push(editUserSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
