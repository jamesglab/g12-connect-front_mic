import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { numberOnly } from 'src/app/_helpers/tools/validators.tool';

import { AddUserComponent } from '../components/add-user/add-user.component';
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

  constructor(private modalService: NgbModal, private fb: FormBuilder,
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
    })
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
    this.submitted = true;
    this.validateFields();
    if (this.filterForm.invalid) {
      return;
    }
    this.isLoading = true;
    let filter = {};
    for (let i in this.filterForm.getRawValue()) {
      if (this.filterForm.getRawValue()[i] && i != "filter") {
        filter[i] = this.filterForm.getRawValue()[i];
      }
    }
    this.adminUsersService.filter = filter;
    this.adminUsersService.handleReload(); //TO MAKE QUERY THROW TABLE COMPONENT
  }

  handleCreate(event: any) {
    event.preventDefault();
    const MODAL = this.modalService.open(AddUserComponent, {
      windowClass: 'fadeIn',
      size: 'xl',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    // MODAL.componentInstance.leaderItem = element;
    MODAL.result.then((data) => {
      if (data == 'success') {
        this.adminUsersService.handleReload();
      }
    }, (reason) => {
    });
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
