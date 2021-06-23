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
  selector: 'app-add-user-type',
  templateUrl: './add-user-type.component.html',
  styleUrls: ['./add-user-type.component.scss']
})
export class AddUserTypeComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public createUserTypeForm: FormGroup;
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef,
    private _adminUserService: AdminUsersService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.createUserTypeForm = this.fb.group({
      Name: [null, [Validators.required, Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ ]+$/)]],
      Description: [null, [Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ ]+$/)]],
      Available: [true],
      UserCreation: [null]
    });
  }

  get form() {
    return this.createUserTypeForm.controls;
  }

  onSubmit() {

    if (this.createUserTypeForm.invalid) {
      return;
    }
    // this.isLoading = true;
    // this.form.UserCreation.setValue(this.currentUser.idUser);

    // const createUserTypeSubscr = this._adminUserService
    //   .createUserType(this.createUserTypeForm.getRawValue()).subscribe((res: Response) => {
    //     this.isLoading = false;
    //     if(res){
    //       if(res.result){
    //         this.showMessage(1,"¡El tipo de usuario ha sido creado con exito!");
    //         this.modal.close('success');
    //       }else{
    //         this.showMessage(2, res.message[0]);
    //       }
    //     }else{
    //       this.showMessage(3)
    //     }
    //   }, err =>{ this.isLoading = false; this.showMessage(3); throw err; });
    // this.unsubscribe.push(createUserTypeSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
