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

  public roles = [];
  public user_roles = [];
  public user: any = null;
  public asignRoleForm: FormGroup;

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private _adminUserService: AdminUsersService,) { }

  ngOnInit(): void {
    this.getUserRoles();
  }

  //BUSCAMOS LOS ROLES DEL USUARIO
  getUserRoles() {
    const getUserObjectsSubscr = this._adminUserService
      .getUserRoles(this.user.id).subscribe((res: any) => {
        //ASIGNAMOS LOS ROLES DEL USUARIO
        this.user_roles = res;
        //MAPEAMOS LOS ROLES DEL USUARIO
        res.map(rol => {
          //MAPEAMOS LOS ROLES DE LA PLATAFORMA QUE SE CONSULTARON EN LA TABLA
          this.roles.map((general_rol: any, i) => {
          //VERIFICAMOS LOS ROLES DEL USUARIO VS LOS ROLES DE LA PLATAFORMA
            if (rol.id == general_rol.id) {
              //ELIMINAMOS EL ROL DE LOS ROLES GENERALES SI FUE ENCONTRADO
              this.roles.splice(i, 1)
            }
          });
        });
      }, err => { this.isLoading = false; throw err; });
    this.unsubscribe.push(getUserObjectsSubscr);
  }

  onSearch(arrayType: string, value: string) {

  }

  addRole(role: any, i) {
    this._adminUserService
      .createUserRole({ user: this.user.id, role: role.id }).subscribe((res: Response) => {
        this.user_roles.push(role);
        this.roles.splice(i, 1);
        this.showMessage(1, "¡El rol ha sido añadido con exito!");
      }, err => { this.showMessage(3); throw err; });

  }

  deleteRole(role, i) {
    this._adminUserService
      .deleteUserRole({ user: this.user.id, role: role.id }).subscribe((res: Response) => {
        this.showMessage(1, "¡El rol ha sido eliminado!");
        this.roles.push(role);
        this.user_roles.splice(i, 1);
      }, err => { this.showMessage(3, err.error.message); throw err; });
  }


  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
