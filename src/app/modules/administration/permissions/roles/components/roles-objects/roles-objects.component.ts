import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { AdminRolesService } from '../../../../_services/admin-roles.service';

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
    public fb: FormBuilder,
    private _adminRolesService: AdminRolesService) { }

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

  //REMMOVEMOS EL PERMISO
  removeObject(permission, i) {
    // CONSUMIMOS EL ENDPOINT PARA ELIMINAR UN PERMISO DEL ROL
    this._adminRolesService.removeRolePermission({ id_role: this.role.id, id_permission: permission.id }).subscribe(res => {
      // ELIMNARLOS EL PERMISO DEL ROL
      this.role.permission.splice(i, 1);
      // AGREGAMOS EL PERMISO ELIMINADO A TODOS LOS PERMISOS
      this.allPermissions.push(permission)
      this.showMessage(1, 'Permiso removido');
    })
  }

  addPermission(permission, i) {
    //AGREGAMOS EL PERMISO AL ROL
    this._adminRolesService.addRolePermission({ id_role: this.role.id, id_permission: permission.id }).subscribe(res => {
      //ELIMINAMOS EL PERMISO DE LOS PERMISOS GENERALESS
      this.allPermissions.splice(i, 1);
      //AGREGAMOS EL PERMISO A LOS PERMISOS DEL ROL
      this.role.permission.push(permission)
      //MOSTRAMOS EL MENSAJE DE SUCCESS 
      this.showMessage(1, 'Permiso agregado');
    })
  }


  //MOSTRAMOS MENSAJES
  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
