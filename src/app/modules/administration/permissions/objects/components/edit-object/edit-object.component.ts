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
  selector: 'app-edit-object',
  templateUrl: './edit-object.component.html',
  styleUrls: ['./edit-object.component.scss'],
})
export class EditObjectComponent implements OnInit {
  public object: any = null;
  public editObjectForm: FormGroup;
  public objectTypes: any[] = [];
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];
  constructor(
    public modal: NgbActiveModal,
    private snackBar: MatSnackBar,
    public fb: FormBuilder,
    private _adminObjectsService: AdminRolesService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  //METODO PARA CREAR EL FORMULARIO
  buildForm() {
    //CREAMOS EL FORMULARIO REACTIVO Y ANEXAMOS LOS VALIDADORES CORRESPONDIENTES
    this.editObjectForm = this.fb.group({
      id: [this.object.id, Validators.required],
      value: [
        { value: this.object.value, disabled: true },
        [Validators.required],
      ],
      type: [this.object.type],
      status: [this.object.status],
      description: [
        this.object.description,
        [Validators.pattern(/^[a-zA-Z0-9+,.óÓííéÉáÁúÚ ]+$/)],
      ],
    });
  }

  //ENVIAMOS LA SOLICITUD
  onSubmit() {
    //VALIDAMOS LOS CAMPOS DEL FORMULARIO
    if (this.editObjectForm.invalid) {
      return;
    }
    //MOSTRAMOS EL LOADER
    this.isLoading = true;
    //CONSUMIMOS EL ENDPOINT 
    const createRoleSubscr = this._adminObjectsService
      // ENVIAMOS LOS CAMPOS DEL FOMULARIO
      .updatePermission(this.editObjectForm.getRawValue())
      .subscribe(
        (res: Response) => {
          //OCULTAMOS EL LOADER
          this.isLoading = false;
          //MOSTRAMOS EL MENSAJE SUCCESS
          this.showMessage(1, '¡El objeto ha sido modificado con exito!');
          this.modal.close('success');
        },
        (err) => {
          //OCUALTAMOS EL LOADER
          this.isLoading = false;
          //MOSTRAMOS EL ERROR DEL BACKEND
          this.showMessage(3, err.error.message);
          throw err;
        }
      );
    this.unsubscribe.push(createRoleSubscr);
  }

  //ACCEDES A LOS CONTROLES DEL FORMULARIO
  get form() {
    return this.editObjectForm.controls;
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(
      NotificationComponent,
      notificationConfig(type, message)
    );
  }

  //ELIMINAMOS LAS SUBSCRIPCIONES QUE SE ABRIERON
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
