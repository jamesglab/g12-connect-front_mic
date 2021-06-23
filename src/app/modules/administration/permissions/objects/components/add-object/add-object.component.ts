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
  selector: 'app-add-object',
  templateUrl: './add-object.component.html',
  styleUrls: ['./add-object.component.scss']
})
export class AddObjectComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  
  public createObjectForm: FormGroup;
  // public objectTypes: any[] = [];

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef,
    private _adminObjectsService: AdminObjectsService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
    // this.getObjectTypes();
  }

  buildForm() {
    this.createObjectForm = this.fb.group({
      value: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9+óÓííéÉáÁ ]+$/)]],
      type: [null],
      description: [null, [Validators.pattern(/^[a-zA-Z0-9+óÓííéÉáÁ ]+$/)]],
      status: [true]
    });
  }

  get form() {
    return this.createObjectForm.controls;
  }

  // getObjectTypes() {
  //   const getUserTypesSubscr = this._adminObjectsService
  //     .getObjectTypes().subscribe((res: Response) => {
  //       if (res.result) {
  //         this.objectTypes = res.entity;
  //         this.cdr.detectChanges();
  //       }
  //     }, err => { throw err; });
  //   this.unsubscribe.push(getUserTypesSubscr);
  // }

  onSubmit() {

    if (this.createObjectForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.form.type.setValue('objectRoles');

    const createRoleSubscr = this._adminObjectsService
      .createObject(this.createObjectForm.getRawValue()).subscribe((res: Response) => {
        this.isLoading = false;
        this.showMessage(1,"¡El nuevo objeto ha sido creado con exito!");
        this.modal.close('success');
      }, err =>{ this.isLoading = false; this.showMessage(3,err.error.message); throw err; });
    this.unsubscribe.push(createRoleSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
