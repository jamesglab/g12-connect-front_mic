import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Response } from 'src/app/modules/auth/_models/auth.model';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminUsersService } from '../../../../_services/admin-users.service';
import { AdminObjectsService } from '../../../../_services/admin-objects.service';

@Component({
  selector: 'app-user-objects',
  templateUrl: './user-objects.component.html',
  styleUrls: ['./user-objects.component.scss']
})
export class UserObjectsComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public user: any = null;
  public asignObjectsForm: FormGroup;
  public userTypes: any[] = [];

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef, private _storageService: StorageService,
    private _adminUserService: AdminUsersService, private _adminObjectsService: AdminObjectsService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getAllObjects();
  }

  buildForm() {
    this.asignObjectsForm = this.fb.group({
      User: [this.user.idUser],
      UserCreate: [this.currentUser.idUser],
      allObjects: [[]],
      allObjectsSearch: [[]],
      ListObject: [[]],
      ListObjectSearch: [[]]
    });
  }

  get form() {
    return this.asignObjectsForm.controls;
  }

  addObject(nameFormControl: string, object: any) {
    this.form[nameFormControl].setValue([...this.form[nameFormControl].value, object])
  }

  removeObject(nameFormControl: string, i) {

    this.form[nameFormControl].value;
    let object = this.form[nameFormControl].value[i];
    this.form[nameFormControl].value.splice(i, 1);

    let array = this.form[nameFormControl.replace("Search", "")].value;
    array.map((_object, _i) => {
      if (object.IdObject == _object.IdObject) {
        array.splice(_i, 1);
      }
    })

    if (nameFormControl === "allObjectsSearch") {
      this.addObject('ListObject', object);
      this.addObject('ListObjectSearch', object);
    } else {
      this.addObject('allObjects', object);
      this.addObject('allObjectsSearch', object);
    }
  }

  getAllObjects() {
    this.isLoading = true;
    // const getObjectsSubscr = this._adminObjectsService
    //   .getObjects().subscribe((res: Response) => {
    //     if (res.result) {
          
    //       for (let i = 0; i < res.entity.length; i++) {
    //         if (res.entity[i].disposable) {
    //           this.addObject('allObjects', {
    //             IdObject: res.entity[i].id,
    //             name: res.entity[i].object, description: res.entity[i].description
    //           });
    //           this.addObject('allObjectsSearch', {
    //             IdObject: res.entity[i].id,
    //             name: res.entity[i].object, description: res.entity[i].description
    //           })
    //         }
    //       }

    //       this.getUserObjects();
    //     }
    //   }, err => { this.isLoading = false; throw err; });
    // this.unsubscribe.push(getObjectsSubscr);
  }

  getUserObjects() {
    // const getUserObjectsSubscr = this._adminUserService
    //   .getUserObjects(this.user.idUser).subscribe((res: Response) => {
    //     if (res.result) {

    //       for (let i = 0; i < res.entity.length; i++) {
    //         this.addObject('ListObject', {
    //           IdObject: res.entity[i].idObject,
    //           name: res.entity[i].object, description: res.entity[i].description || ""
    //         });
    //         this.addObject('ListObjectSearch', {
    //           IdObject: res.entity[i].idObject,
    //           name: res.entity[i].object, description: res.entity[i].description || ""
    //         })
    //         this.form.allObjects.value.map((item, _i) => {
    //           if (item.IdObject == res.entity[i].idObject) {
    //             this.form.allObjects.value.splice(_i, 1);
    //             this.form.allObjectsSearch.value.splice(_i, 1);
    //           }
    //         })
    //       }
    //       this.isLoading = false;
    //     }
    //   }, err => { this.isLoading = false; throw err; });
    // this.unsubscribe.push(getUserObjectsSubscr);
  }

  onSearch(arrayType: string, value: string) {
    value = value.toLowerCase();
    let filtered = this.form[arrayType].value.filter(object => object.name.toLowerCase().includes(value));
    this.form[arrayType + "Search"].setValue(filtered);
  }

  onSubmit() {

    if (this.asignObjectsForm.invalid) {
      return
    }

    const { User, UserCreate, ListObject } = this.asignObjectsForm.getRawValue();

    ListObject.map(item => {
      delete item.name;
      delete item.description;
    })

    const createUserObjectSubscr = this._adminUserService
      .createUserObjects({ User, UserCreate, ListObject }).subscribe((res: Response) => {
        if (res) {
          if (res.result) {
            this.showMessage(1, "??Los objetos han sido modificados correctamente!");
            this.modal.close('success');
          } else {
            this.showMessage(2, res.message[0]);
          }
        } else {
          this.showMessage(3)
        }
      }, err => { this.showMessage(3); throw err; });
    this.unsubscribe.push(createUserObjectSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
