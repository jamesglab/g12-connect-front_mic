import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { Response } from 'src/app/modules/auth/_models/auth.model';
import { AdminRolesService } from 'src/app/modules/administration/_services/admin-roles.service';

@Component({
  selector: 'app-add-object',
  templateUrl: './add-object.component.html',
  styleUrls: ['./add-object.component.scss']
})
export class AddObjectComponent implements OnInit {

  public createObjectForm: FormGroup;
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private _adminObjectsService: AdminRolesService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  // CREAMOS EL FOMULARIO
  buildForm() {
    // CREAMOS EL FOMULARIO REACTIVO Y ANEXAMOS LOS VALIDADORES CORRESPONDIENTES
    this.createObjectForm = this.fb.group({
      value: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9+óÓííéÉáÁ ]+$/)]],
      description: [null, [Validators.pattern(/^[a-zA-Z0-9+óÓííéÉáÁ ]+$/)]],
      status: [true]
    });
  }

  //ENVIAMOS LA SOLICITUD
  onSubmit() {
    //VALIDAMOS QUE LOS CAMPOS DEL FORMULARIO ESTEN CORRECTOS
    if (this.createObjectForm.invalid) {
      return;
    }
    //MOSTRAMOS EL LOADER
    this.isLoading = true;
    // CONSUMIMOS EL ENDPOPINT DE CREACION DE PERMISO
    const createRoleSubscr = this._adminObjectsService
      //ENVIAMOS LOS DATOS DEL FORMULARIO
      .ceratePermission(this.createObjectForm.getRawValue()).subscribe((res: Response) => {
        //OCULTMOS EL LOADER
        this.isLoading = false;
        //MOSTRAMOS EL LOADER
        this.showMessage(1, "¡El nuevo objeto ha sido creado con exito!");
        this.modal.close('success');
      }, err => { this.isLoading = false; this.showMessage(3, err.error.message); throw err; });
    this.unsubscribe.push(createRoleSubscr);
  }

  // ACCEDEMOS A LOS CONTROLES DEL FORMULARIO
  get form() {
    return this.createObjectForm.controls;
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
