import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AdminUsersService } from '../../_services/admin-users.service';

@Component({
  selector: 'app-create-box',
  templateUrl: './create-box.component.html',
  styleUrls: ['./create-box.component.scss'],
})
export class CreateBoxComponent implements OnInit {
  public name = new FormControl('');
  public status = new FormControl(true);
  public isLoading: boolean;
  constructor(
    public modal: NgbActiveModal,
    public adminUserService: AdminUsersService
  ) {}

  ngOnInit(): void {}

  submit() {
    if (this.name.value) {
      this.isLoading = true;
      this.adminUserService
        .createBox({
          name: this.name.value,
          status: this.status.value,
        })
        .subscribe(
          (res) => {
            this.modal.close(true);
            Swal.fire('Caja creada', '', 'success');
          },
          (err) => {
            this.isLoading = false;
            Swal.fire(err ? err : 'No se pudo crear la caja', '', 'error');
            throw err;
          }
        );
    } else {
      Swal.fire('Debes asignarle nombre la caja', '', 'info');
    }
  }
}
