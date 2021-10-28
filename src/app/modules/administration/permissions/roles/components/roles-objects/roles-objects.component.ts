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

  public role: any = null;
  public allPermissions: any = [];
  public asignObjectsForm: FormGroup;

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef, private _storageService: StorageService,
    private _adminRolesService: AdminRolesService, private _RolesService: AdminRolesService, private _adminObjectsService: AdminObjectsService) { }

  ngOnInit(): void {
    this.deletePermissionsInRole();


  }

  //VALIDAREMOS LOS PERMISOS EN EL ROL
  deletePermissionsInRole() {
    //MAPEAMOS LOS PERMISOS DEL ROL
    this.role.permission.map(role_permission => {
      //MAPEAMOS LOS PERMISSOS PARA BUSCAR EL PERMISO DEL ROL EN TODOS LOS PERMISOS
      this.allPermissions.map((permission, i) => {
        //SI ENCONTRAMOS EL PERMISO VALIDAMOS
        if (permission.value == role_permission.value) {
          //ELIMINAMOS EL PERMISO EN EL ARRAY DE allPermissions
          this.allPermissions.splice(i, 1);
        }
      })
    });
  }

  //REMMOVEMOS EL OBJETO
  removeObject(permission, i) {
    this._adminRolesService.removeRolePermission({ id_role: this.role.id, id_permission: permission.id }).subscribe(res => {
      this.role.permission.splice(i, 1);
      this.allPermissions.push(permission)
      this.showMessage(1, 'Permiso removido');
    })
  }

  addRole(permission, i) {
    this._adminRolesService.addRolePermission({ id_role: this.role.id, id_permission: permission.id }).subscribe(res => {
      this.allPermissions.splice(i, 1);
      this.role.permission.push(permission)
      this.showMessage(1, 'Permiso agregado');
    })
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
