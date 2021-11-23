import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AdminUsersService } from '../../_services/admin-users.service';

@Component({
  selector: 'app-edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss'],
})
export class EditBoxComponent implements OnInit {
  public isLoading: boolean;
  public readonly box: any;

  public name = new FormControl();
  public status = new FormControl();

  constructor(
    public modal: NgbActiveModal,
    public adminUserService: AdminUsersService
  ) {}

  ngOnInit(): void {
    this.buildInputs();
  }

  buildInputs() {
    this.name.setValue(this.box.name);
    this.status.setValue(this.box.status);
  }

  submit() {
    //VALIDAMOS EL NOMBRE DE LA CAJA
    if (this.name.value) {
      //CREAMOS LA SOLICIUTD DE ACRTUALIZACION DE LA CAJA
      this.isLoading = true;
      this.adminUserService
        .updateBox({
          ...this.box,
          status: this.status.value,
          name: this.name.value,
        })
        .subscribe(
          (res) => {
            this.modal.close(true);
            this.isLoading = false;
            Swal.fire('Caja actualizada', '', 'success');
          },
          (err) => {
            this.isLoading = false;
            Swal.fire(err ? err : 'No se pudo actualizar la caja', '', 'error');
          }
        );
    } else {
      Swal.fire('Debes asignarle nombre la caja', '', 'info');
    }
  }
}
