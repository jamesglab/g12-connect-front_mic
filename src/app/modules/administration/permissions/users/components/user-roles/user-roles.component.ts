import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Response } from 'src/app/modules/auth/_models/auth.model';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminUsersService } from '../../../../_services/admin-users.service';
import { AdminRolesService } from '../../../../_services/admin-roles.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public user: any = null;
  public asignRoleForm: FormGroup;

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef, private _storageService: StorageService,
    private _adminUserService: AdminUsersService, private _adminRolesService: AdminRolesService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getAllRoles();
  }

  buildForm() {
    this.asignRoleForm = this.fb.group({
      id: [this.user.id],
      allRoles: [[]],
      allRolesSearch: [[]],
      listRolesUser: [[]],
      listRolesUserSearch: [[]]
    });
  }

  get form() {
    return this.asignRoleForm.controls;
  }

  addObject(nameFormControl: string, object: any) {
    this.form[nameFormControl].setValue([...this.form[nameFormControl].value, object])
  }

  removeObject(nameFormControl: string, i) {

    this.form[nameFormControl].value;
    let role = this.form[nameFormControl].value[i];
    this.form[nameFormControl].value.splice(i, 1);

    let array = this.form[nameFormControl.replace("Search", "")].value;
    array.map((_role, _i) => {
      if (role.id == _role.id) {
        array.splice(_i, 1);
      }
    })

    if (nameFormControl === "allRolesSearch") {
      this.addObject('listRolesUser', role);
      this.addObject('listRolesUserSearch', role);
      this.addRole(role);
    } else {
      this.addObject('allRoles', role);
      this.addObject('allRolesSearch', role);
      this.deleteRole(role);
    }
  }

  getAllRoles() {

    this.isLoading = true;
    const getObjectsSubscr = this._adminRolesService
      .getRoles().subscribe((res: any) => {

          // console.log("ALL ROLES", res.entity);
          for (let i = 0; i < res.length; i++) {
            const { id, name, description } = res[i];
              this.addObject('allRoles', { id, name, description });
              this.addObject('allRolesSearch', { id, name, description });
          }
          this.getUserRoles();
      }, err => { this.isLoading = false; throw err; });
    this.unsubscribe.push(getObjectsSubscr);
  }

  getUserRoles() {
    const getUserObjectsSubscr = this._adminUserService
      .getUserRoles(this.user.id).subscribe((res: any) => {
        console.log("ROLES DEL USUARIO", res);
        // if (res.result) {

          // console.log("RES.ENTITYY", res.entity);
          for (let i = 0; i < res.length; i++) {
            const { id, name, description } = res[i];
            this.addObject('listRolesUser', { id, name, description });
            this.addObject('listRolesUserSearch', { id, name, description });
          }
          this.form.listRolesUser.value.map((item, _i) => {

            const index = this.form.allRoles.value
              .findIndex((element) => element.id === item.id);
            // console.log("INDEX ENCONTRADO EN ALL OBJECTS", index);
      
            this.form.allRoles.value.splice(index, 1);
            this.form.allRolesSearch.value.splice(index, 1);
          })

          this.isLoading = false;
        // }
      }, err => { this.isLoading = false; throw err; });
    this.unsubscribe.push(getUserObjectsSubscr);
  }

  onSearch(arrayType: string, value: string) {
    value = value.toLowerCase();
    let filtered = this.form[arrayType].value.filter(object => object.name.toLowerCase().includes(value));
    this.form[arrayType + "Search"].setValue(filtered);
  }

  addRole(role) {
    const createRoleSubscr = this._adminUserService
      .createUserRole({ user: this.user.id, role: role.id }).subscribe((res: Response) => {
        this.showMessage(1, "¡El rol ha sido añadido con exito!");
        this.modal.close('success');
      }, err => { this.showMessage(3); throw err; });
    this.unsubscribe.push(createRoleSubscr);
  }

  deleteRole(role) {
    // console.log("SE FUE EL AÑADIR", { user: this.user.id, role: role.id })
    const deleteRoleSubscr = this._adminUserService
      .deleteUserRole({ user: this.user.id, role: role.id }).subscribe((res: Response) => {
        this.showMessage(1, "¡El rol ha sido eliminado!");
        this.modal.close('success');
      }, err => { this.showMessage(3, err.error.message); throw err; });
    this.unsubscribe.push(deleteRoleSubscr);
  }

  // onSubmit() {

  //   if (this.asignRoleForm.invalid) {
  //     return
  //   }

  //   const { User, UserCreate, ListObject } = this.asignRoleForm.getRawValue();

  //   ListObject.map(item => {
  //     delete item.name;
  //     delete item.description;
  //   })

  //   const createUserObjectSubscr = this._adminUserService
  //     .createUserObjects({ User, UserCreate, ListObject }).subscribe((res: Response) => {
  //       if (res) {
  //         if (res.result) {
  //           this.showMessage(1, "¡Los objetos han sido modificados correctamente!");
  //           this.modal.close('success');
  //         } else {
  //           this.showMessage(2, res.message[0]);
  //         }
  //       } else {
  //         this.showMessage(3)
  //       }
  //     }, err => { this.showMessage(3); throw err; });
  //   this.unsubscribe.push(createUserObjectSubscr);
  // }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
