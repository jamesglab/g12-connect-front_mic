import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUsersService } from 'src/app/modules/administration/_services/admin-users.service';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-box-user',
  templateUrl: './add-box-user.component.html',
  styleUrls: ['./add-box-user.component.scss'],
})
export class AddBoxUserComponent implements OnInit {
  public current_user = this.storageService.getItem('auth').user;
  public user;
  public boxes;
  public box_selected = new FormControl('');
  public user_selected = new FormControl({ value: '', disabled: true });
  public isLoading: boolean;
  

  constructor(
    private adminUserService: AdminUsersService,
    public modal: NgbActiveModal,
    public storageService: StorageService
  ) {}

  ngOnInit(): void {
    //ASIGNAMOS EL USUARIO AL INPUT QUE NO SE DEJARA EDITAR PARA VISUALIZAR AL USUARIO
    this.user_selected.setValue(this.user.name + '' + this.user.last_name);
    this.boxes.map((box) => {
      if (box.user.id == this.user.id) {
        this.box_selected.setValue(box);
      }
    });
  }

  submit() {
    //VALIDAMOS QUE EXISTA UNA CAJA SELECCIONADA
    if (!this.box_selected.value) {
      Swal.fire('No has seleccionado una caja', '', 'info');
      return;
    }

    //VALIDAMOS QUE LA CAJA YA TENGA UN USUARIO ASIGNADO
    if (this.box_selected.value.user) {
      Swal.fire({
        title: 'Esta caja ya tiene un usuario',
        icon: 'question',
        text: `¿Deseas asignar la caja ${this.box_selected.value.name} a el usuario ${this.user.name} ${this.user.last_name}?`,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sendUpdateBox();
        }
      });
    } else {
      this.sendUpdateBox();
    }
  }

  sendUpdateBox() {
    this.isLoading = true;
    this.adminUserService
      .assignUserToBox({
        ...this.box_selected.value,
        user: this.user.id,
      })
      .subscribe(
        (res) => {
          Swal.fire(
            `Caja ${this.box_selected.value.name} asignada a el usuario ${this.user.name} ${this.user.last_name}`,
            '',
            'success'
          );
          this.modal.close();
        },
        (err) => {
          this.isLoading = false;
          Swal.fire(err ? err : 'No se pudo actualizar la caja', '', 'error');
          this.modal.close();
          throw err;
        }
      );
  }
}
