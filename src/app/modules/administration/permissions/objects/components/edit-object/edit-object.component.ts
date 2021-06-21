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
  selector: 'app-edit-object',
  templateUrl: './edit-object.component.html',
  styleUrls: ['./edit-object.component.scss']
})
export class EditObjectComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public object: any = null;
  public editObjectForm: FormGroup;
  public objectTypes: any[] = [];

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef,
    private _adminObjectsService: AdminObjectsService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getObjectTypes();
  }

  buildForm() {
    this.editObjectForm = this.fb.group({
      IdObject:[this.object.id, Validators.required],
      Type: [this.object.idTypeObject.toString(), [Validators.required]],
      Name: [this.object.object, [Validators.required, Validators.pattern(/^[a-zA-Z0-9+,.óÓííéÉáÁúÚ ]+$/)]],
      Description: [this.object.description, [Validators.pattern(/^[a-zA-Z0-9+,.óÓííéÉáÁúÚ ]+$/)]],
      Available: [this.object.disposable.toString()],
      UserModified: [null]
    });
  }

  get form() {
    return this.editObjectForm.controls;
  }

  getObjectTypes() {
    // const getUserTypesSubscr = this._adminObjectsService
    //   .getObjectTypes().subscribe((res: Response) => {
    //     if (res.result) {
    //       this.objectTypes = res.entity;
    //       this.cdr.detectChanges();
    //     }
    //   }, err => { throw err; });
    // this.unsubscribe.push(getUserTypesSubscr);
  }

  onSubmit() {

    if (this.editObjectForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.form.UserModified.setValue(this.currentUser.idUser);
    this.form.Type.setValue(parseInt(this.form.Type.value));
    this.form.Available.setValue((this.form.Available.value) == "true");

    const createRoleSubscr = this._adminObjectsService
      .editObject(this.editObjectForm.getRawValue()).subscribe((res: Response) => {
        this.isLoading = false;
        if (res) {
          if (res.result) {
            this.showMessage(1, "¡El objeto ha sido modificado con exito!");
            this.modal.close('success');
          } else {
            this.showMessage(2, res.message[0]);
          }
        } else {
          this.showMessage(3)
        }
      }, err => { this.isLoading = false; throw err; });
    this.unsubscribe.push(createRoleSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
