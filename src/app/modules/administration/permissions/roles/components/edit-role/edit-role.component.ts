import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Response } from 'src/app/modules/auth/_models/auth.model';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminRolesService } from '../../../../_services/admin-roles.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  public role: any = null;
  public editRoleForm: FormGroup;
  public isLoading: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder,
    private _adminRolesService: AdminRolesService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  // CREAMOS EL FORMULARIO Y LE PASAMOS LOS DATOS A EDITAR DEL ROL
  buildForm() {
    // CREAMOS EL FORMULARIO Y ANEXAMOS LOS VALIDADORES
    this.editRoleForm = this.fb.group({
      id: [this.role.id, Validators.required],
      name: [this.role.name, [Validators.required, Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ0-9 ]+$/)]],
      description: [this.role.description, [Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ0-9 ]+$/)]],
      status: [this.role.status]
    });
  }


  // ENVIAMOS LA PETICION
  onSubmit() {
    //VALIDAMOS LOS CAMPOS DEL FORMULARIO
    if (this.editRoleForm.invalid) {
      return;
    }
    //MOSTRAMOS EL LOADER
    this.isLoading = true;
    //CONSUMIMOS EL ENDPOINT DE ACTUALIZAR EL ROL
    const editRoleSubscr = this._adminRolesService
      .editRole(this.editRoleForm.getRawValue()).subscribe((res: Response) => {
        //OCULTAMOS EL LOADER
        this.isLoading = false;
        //MOSTRAMOS MENSAJE DE ACTUALIZADO
        this.showMessage(1, "¡El rol ha sido modificado con exito!");
        this.modal.close('success');
        //VALIDAMOS EL ERROR QUE PUEDA GENERAL EL BACKEND
      }, err => { this.isLoading = false; this.showMessage(3, err.error.message); throw err; });
    this.unsubscribe.push(editRoleSubscr);
  }


  //ACCEDEMOS A LOS CONTROLES DEL FORMULARIO
  get form() {
    return this.editRoleForm.controls;
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
