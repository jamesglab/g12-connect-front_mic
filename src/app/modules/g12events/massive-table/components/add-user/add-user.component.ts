import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';
import Swal from 'sweetalert2';
import { G12eventsService } from '../../../_services/g12events.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserMassiveComponent implements OnInit {

  public add_user: FormGroup;
  public transaction: any;
  public leaders: [] = [];
  public countries: any[] = COUNTRIES;//LISTADO DE PAISES;
  public isLoading: boolean = false;
  constructor(private fb: FormBuilder, public modal: NgbActiveModal, private g12EventService: G12eventsService,public cdr : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.buildForm();
  }

  // CREAMOS EL FORMULARIO
  buildForm() {
    this.add_user = this.fb.group({
      transaction_id: [this.transaction.transaction.id, Validators.required],
      country: [null, Validators.required],
      document: [null, Validators.required],
      document_type: [null],
      name: [null, Validators.required],
      last_name: [null, Validators.required],
      gender: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      confirm_email: [null, Validators.compose([Validators.required, Validators.email])],
      pastor: [],
      leader: [null, Validators.required],
    });

  }


  addUserSend() {
    if (this.add_user.invalid) {
      Swal.fire('Datos incompletos', '', 'info');
      return
    }
    if (this.add_user.value.email != this.add_user.value.confirm_email) {
      Swal.fire('Los correos no coinciden', '', 'info')
      return
    }
    this.isLoading = true;
    this.g12EventService.addUser(this.add_user.getRawValue()).subscribe(res => {
      Swal.fire('Usuario Agregado', '', 'success').then(res => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.modal.close(res);
      })
    }, err => {
      this.isLoading = false;
      console.log('eerrr',err)
      this.cdr.detectChanges();
      Swal.fire(err.message ? err.message : 'No se pudo ejecutar la acción', '', 'error')
    })

  }


}
