import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Response } from 'src/app/modules/auth/_models/auth.model';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminRolesService } from '../../../../_services/admin-roles.service';
import { AdminObjectsService } from '../../../../_services/admin-objects.service';

@Component({
  selector: 'app-roles-objects',
  templateUrl: './roles-objects.component.html',
  styleUrls: ['./roles-objects.component.scss']
})
export class RolesObjectsComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public role: any = null;
  private allObjectsItems: any = {};
  public asignObjectsForm: FormGroup;

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef, private _storageService: StorageService,
    private _adminRolesService: AdminRolesService, private _adminObjectsService: AdminObjectsService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getAllObjects();
  }

  buildForm() {
    this.asignObjectsForm = this.fb.group({
      id: [this.role.id],
      allObjects: [[]],
      allObjectsSearch: [[]],
      listObjectsRole: [[]],
      listObjectsRoleSearch: [[]]
    });
  }

  get form() {
    return this.asignObjectsForm.controls;
  }

  addObject(nameFormControl: string, object: any) {
    this.form[nameFormControl].setValue([object, ...this.form[nameFormControl].value])
  }

  removeObject(nameFormControl: string, i) {

    let object = this.form[nameFormControl].value[i];
    this.form[nameFormControl].value.splice(i, 1); //PRIMERO ELIMINAR DEL SEARCH

    let array = this.form[nameFormControl.replace("Search", "")].value;
    array.map((_object, _i) => {
      if (object.id == _object.id) {
        array.splice(_i, 1);
      }
    })

    if (nameFormControl === "allObjectsSearch") {
      this.addObject('listObjectsRole', object);
      this.addObject('listObjectsRoleSearch', object);
    } else {
      this.addObject('allObjects', object);
      this.addObject('allObjectsSearch', object);
    }
  }

  getAllObjects() {
    this.isLoading = true;
    const getObjectsSubscr = this._adminObjectsService
      .getObjects({ type: 'objectRoles', status: true }).subscribe((res: any) => {
        res = res.reverse();
        for (let i = 0; i < res.length; i++) {

          if (!this.allObjectsItems[res[i].value]) {
            this.allObjectsItems[res[i].value] = res[i];
          }
          const { id, value, description } = res[i];
          this.addObject('allObjects', { id, value, description });
          this.addObject('allObjectsSearch', { id, value, description });

        }
        this.getRoleObjects();
      }, err => { this.isLoading = false; throw err; });
    this.unsubscribe.push(getObjectsSubscr);
  }

  getRoleObjects() {
    // const getUserObjectsSubscr = this._adminRolesService
    //   .getRoleObjects(this.role.id).subscribe((res: Response) => {
    // console.log("RESPONSEEE", res.entity)
    // console.log("COPITASSS", this.role.permissions)

    for (let i = 0; i < this.role.permissions.length; i++) {
      this.addObject('listObjectsRole', this.allObjectsItems[this.role.permissions[i]]);
      this.addObject('listObjectsRoleSearch', this.allObjectsItems[this.role.permissions[i]])
    }

    // console.log("OBJETOS DEL ROLE", this.form.listObjectsRole.value);
    // console.log("TODOS LOS OBJETOS", this.form.allObjects.value);

    this.form.listObjectsRole.value.map((item, _i) => {

      const index = this.form.allObjects.value
        .findIndex((element) => element.id === item.id);
      // console.log("INDEX ENCONTRADO EN ALL OBJECTS", index);

      this.form.allObjects.value.splice(index, 1);
      this.form.allObjectsSearch.value.splice(index, 1);
    })
    this.isLoading = false;

    //   }, err => { this.isLoading = false; throw err; });
    // this.unsubscribe.push(getUserObjectsSubscr);
  }

  onSearch(arrayType: string, value: string) {
    value = value.toLowerCase();
    let filtered = this.form[arrayType].value.filter(object => object.value.toLowerCase().includes(value));
    this.form[arrayType + "Search"].setValue(filtered);
  }

  onSubmit() {

    if (this.asignObjectsForm.invalid) {
      return;
    }

    const { id, listObjectsRole } = this.asignObjectsForm.getRawValue();

    let permissions: string[] = [];

    listObjectsRole.map(item => {
      permissions.push(item.value);
    })

    const createRoleObjectSubscr = this._adminRolesService
      .createRoleObjects({ id, permissions }).subscribe((res: Response) => {
            this.showMessage(1, "¡Los objetos han sido modificados correctamente!");
            this.modal.close('success');
      }, err => { this.showMessage(3, err.error.message); throw err; });
    this.unsubscribe.push(createRoleObjectSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
