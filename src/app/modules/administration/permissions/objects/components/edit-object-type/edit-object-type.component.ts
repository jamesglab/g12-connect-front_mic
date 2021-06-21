import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Response } from 'src/app/modules/auth/_models/auth.model';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminObjectsService } from '../../../../_services/admin-objects.service';

@Component({
  selector: 'app-edit-object-type',
  templateUrl: './edit-object-type.component.html',
  styleUrls: ['./edit-object-type.component.scss']
})
export class EditObjectTypeComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public objectType: any = null;
  public editObjectTypeForm: FormGroup;

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef,
    private _adminObjectsService: AdminObjectsService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.editObjectTypeForm = this.fb.group({
      IdTypeObject: [this.objectType.id, Validators.required],
      Name: [this.objectType.name, [Validators.required, Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ0-9 ]+$/)]],
      Description: [this.objectType.description, [Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ0-9 ]+$/)]],
      Available: [this.objectType.disposable.toString()],
      UserModified: [null],
      Application: [1]
    });
  }

  get form() {
    return this.editObjectTypeForm.controls;
  }

  onSubmit() {

    if (this.editObjectTypeForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.form.UserModified.setValue(this.currentUser.idUser);
    this.form.Available.setValue((this.form.Available.value) == "true");

    // const editObjectTypeSubscr = this._adminObjectsService
    //   .editObjectType(this.editObjectTypeForm.getRawValue()).subscribe((res: Response) => {
    //     this.isLoading = false;
    //     if (res) {
    //       if (res.result) {
    //         this.showMessage(1, "¡El tipo de objeto ha sido modificado con exito!");
    //         this.modal.close('success');
    //       } else {
    //         this.showMessage(2, res.message[0]);
    //       }
    //     } else {
    //       this.showMessage(3)
    //     }
    //   }, err => { this.isLoading = false; this.showMessage(3); throw err; });
    // this.unsubscribe.push(editObjectTypeSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
