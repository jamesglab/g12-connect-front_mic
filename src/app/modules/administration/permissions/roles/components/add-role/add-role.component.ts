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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  public createRoleForm: FormGroup;
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef,
    private _adminRolesService: AdminRolesService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.createRoleForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ ]+$/)]],
      description: [null, [ Validators.required,Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ ]+$/)]],
      status: [true],
    });
  }

  get form() {
    return this.createRoleForm.controls;
  }

  onSubmit() {

    if (this.createRoleForm.invalid) {
      Swal.fire('Datos incompletos','','info')
      return;
    }
    this.isLoading = true;

    const createRoleSubscr = this._adminRolesService
      .createRole(this.createRoleForm.getRawValue()).subscribe((res: Response) => {
        this.isLoading = false;
        if(res){
            this.showMessage(1,"¡El nuevo rol ha sido creado con exito!");
            this.modal.close('success');
          
        }else{
          this.showMessage(3)
        }
      }, err =>{ this.isLoading = false; this.showMessage(3); throw err; });
    this.unsubscribe.push(createRoleSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
