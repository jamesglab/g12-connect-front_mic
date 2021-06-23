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

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public role: any = null;
  public editRoleForm: FormGroup;
  public isLoading: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef,
    private _adminRolesService: AdminRolesService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.editRoleForm = this.fb.group({
      id: [this.role.id, Validators.required],
      name: [this.role.name, [Validators.required, Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ0-9 ]+$/)]],
      description: [this.role.description, [Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ0-9 ]+$/)]],
      status: [this.role.status.toString()]
    });
  }

  get form() {
    return this.editRoleForm.controls;
  }

  onSubmit() {

    if (this.editRoleForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.form.status.setValue((this.form.status.value) == "true");

    const editRoleSubscr = this._adminRolesService
      .editRole(this.editRoleForm.getRawValue()).subscribe((res: Response) => {
        this.isLoading = false;
        this.showMessage(1, "¡El rol ha sido modificado con exito!");
        this.modal.close('success');
      }, err => { this.isLoading = false; this.showMessage(3, err.error.message); throw err; });
    this.unsubscribe.push(editRoleSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
