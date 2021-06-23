import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { numberOnly } from 'src/app/_helpers/tools/validators.tool';

import { Response } from 'src/app/modules/auth/_models/auth.model';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminUsersService } from '../../../../_services/admin-users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  //private currentUser: any = this._storageService.getItem("user");
  public user: any = null;
  public editUserForm: FormGroup;
  public userTypes: any[] = [];

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef, private _storageService: StorageService,
    private _adminUserService: AdminUsersService) { }

  ngOnInit(): void {
    console.log("QUÉ PASA TIO", this.user);
    this.buildForm();
    this.getUserTypes();
  }

  buildForm() {
    this.editUserForm = this.fb.group({
      id: [this.user.id],
      identification: [{ value: this.user.identification, disabled: true }],
      name: [{ value: this.user.name, disabled: true }], //FOR RENDER
      last_name: [{ value: this.user.last_name, disabled: true }], // FOR RENDER
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone,[Validators.required, Validators.maxLength(10)]],
      status: [this.user.status.toString()]
    });
  }

  get form() {
    return this.editUserForm.controls;
  }

  numberOnly(event): boolean {
    return numberOnly(event);
  }

  getUserTypes() {
    // const getUserTypesSubscr = this._adminUserService
    //   .getUserTypes().subscribe((res: Response) => {
    //     if (res.result) {
    //       this.userTypes = res.entity;
    //       this.setUserType();
    //       this.cdr.detectChanges();
    //     }
    //   }, err => { throw err; });
    // this.unsubscribe.push(getUserTypesSubscr);
  }

  setUserType(){
    // this.userTypes.map(type => {
    //   if(parseInt(this.form.TypeUser.value) == type.idType){
    //     this.form.Type.setValue(type.name);
    //   }
    // })
  }

  onSubmit() {

    if (this.editUserForm.invalid) {
      return
    }

    this.form.status.setValue((this.form.status.value) == "true");

    const editUserSubscr = this._adminUserService
      .editUser(this.editUserForm.getRawValue()).subscribe((res: Response) => {
            this.showMessage(1,"¡El usuario ha sido modificado correctamente!");
            this.modal.close('success');
      }, err => { this.showMessage(3, err.error.message); throw err;});
    this.unsubscribe.push(editUserSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
