import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { numberOnly } from 'src/app/_helpers/tools/validators.tool';
import { Response } from 'src/app/modules/auth/_models/auth.model';
import { AdminUsersService } from '../../../../_services/admin-users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  //private currentUser: any = this._storageService.getItem("user");
  public user: any = null;
  public editUserForm: FormGroup;
  public userTypes: any[] = [];

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder,private _adminUserService: AdminUsersService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  //CREAMOS EL FORMULARIO Y PASAMOS LOS VALORES DEL USUARIO A EDITAR
  buildForm() {
    this.editUserForm = this.fb.group({
      id: [this.user.id],
      identification: [{ value: this.user.identification, disabled: true }],
      name: [{ value: this.user.name, disabled: true }], //FOR RENDER
      last_name: [{ value: this.user.last_name, disabled: true }], // FOR RENDER
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [Validators.required, Validators.maxLength(10)]],
      status: [this.user.status.toString()]
    });
  }

  //ACCEDEMOS A LOS CONTROLES DEL FORMULARIO
  get form() {
    return this.editUserForm.controls;
  }

  numberOnly(event): boolean {
    return numberOnly(event);
  }

  //EDITAMOS EL USUARIO
  onSubmit() {
    //VALIDAMOS QUE EL FORMULARIO TENGA ERRORES Y RETORNAMOS SI EXISTE ALGUN ERROR
    if (this.editUserForm.invalid) {
      return
    }

    //VALIDOS EL ESTADO DEL USUARIO
    this.form.status.setValue((this.form.status.value) == "true");
    //ENVIAMOS LOS DATOS QUE NECESITAMOS ACTUALIZAR
    const editUserSubscr = this._adminUserService
      .editUser(this.editUserForm.getRawValue()).subscribe((res: Response) => {
        this.showMessage(1, "¡El usuario ha sido modificado correctamente!");
        this.modal.close('success');
      }, err => { this.showMessage(3, err.error.message); throw err; });
    this.unsubscribe.push(editUserSubscr);
  }

  //MOSTRAMOS UN MENSAJE DE ERROR
  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  //ELIMINAMOS LAS SUBSCRIPCIONES
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
