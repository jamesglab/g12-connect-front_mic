import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { numberOnly } from 'src/app/_helpers/tools/validators.tool';
import { AdminUsersService } from '../../../_services/admin-users.service';

@Component({
  selector: 'app-main-users',
  templateUrl: './main-users.component.html',
  styleUrls: ['./main-users.component.scss']
})
export class MainUsersComponent implements OnInit {

  public filterForm: FormGroup;
  public submitted = false;
  public isLoading = false;

  constructor(private fb: FormBuilder,
    private adminUsersService: AdminUsersService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.buildForm();
  }

  // CREAMOS EL FOMULARIO REACTIVO CON LOS CAMPOS QUE NECESITAMOS 
  buildForm(): void {
    this.filterForm = this.fb.group({
      filter: [null, Validators.required], //TIPO DE FILTRO QUE VAMOS A VALIDAR  *'0' = 'IDENTIFICACION' *'1' =EMAIL
      identification: [null],//FILTRO DE IDENTIFICACION
      email: [null],//FUILTRO DE EMAIL
    });
    //DETECTAMO9S LOS CAMBIOS PARA RENDERIZARLOS EN EL HTML
    this.cdr.detectChanges();
  }

  //LIMPIAMOS LOS FILTROS PARA REINICIAR LOS VALORES
  cleanFilter() {
    this.form.identification.setValue(null);
    this.form.identification.setErrors(null);
    this.form.email.setValue(null);
    this.form.email.setErrors(null);
  }

  // VALIDAMOS LOS CAMPOS DE CADA FILTRO
  validateFields() {
    switch (this.form.filter.value) {
      case '0':
          this.form.identification.setValidators([Validators.required]);///VALIDAMOS QUE LA IDENTIFICACION SEA REQUERIDA
        break;
      case '1':
        this.form.email.setValidators([Validators.required])//VALIDAMOS QUE EL EMAIL SEA REQUERIDO
        break;
    }
  }

  onSubmit(): void {
    // MOSTRAMOS EL SUBMITTED PARA VISUALIZAR LOS ERRORES
    this.submitted = true;
    // CREAMOS LOS VALIDADORES DEL FORMULARIO PARA CADA TIPO DE FILTRO
    this.validateFields();
    if (this.filterForm.invalid) {
      //NO CREAMOS CONSULTA SI EXISTEN ERRORES EN EL FORMULARIO
      return;
    }
    //PONEMOS LOADER EN TRUE
    this.isLoading = true;
    //CREAMOS LOS FILTROS 
    let filter = {};
    for (let i in this.filterForm.getRawValue()) {
      if (this.filterForm.getRawValue()[i] && i != "filter") {
        //CREAMOS LOS FILTROS DE MANERA DINAMICA
        filter[i] = this.filterForm.getRawValue()[i];
      }
    }
    //CREAMOS EL FILTRO EN EL SERVICIO DE AdminUsersService PARA QUE FILTRE EN LA TABLA
    this.adminUsersService.filter = filter;
    this.adminUsersService.handleReload(); //TO MAKE QUERY THROW TABLE COMPONENT
  }

  //RETORNAMOS LOS CONTROLES DEL FORMULARIO
  get form() {
    return this.filterForm.controls;
  }

  //METODO PARA VALIDAR QUE SOLO SE INGRESEN NUMEROS EN UN INPUT
  numberOnly(event): boolean {
    return numberOnly(event);
  }
}
