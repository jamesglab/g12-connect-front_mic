import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Response } from 'src/app/modules/auth/_models/auth.model';


import { AdminUsersService } from '../../_services/admin-users.service';
import { AdminRolesService } from '../../_services/admin-roles.service';
import { AdminObjectsService } from '../../_services/admin-objects.service';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.scss']
})
export class DeleteItemComponent implements OnInit {

  public item: any = null;

  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    private _adminUsersService: AdminUsersService, private _adminRolesService: AdminRolesService,
    private _adminObjectsService: AdminObjectsService) { }

  ngOnInit(): void { }

  success() {
    this.delete();
  }

  reject() {
    this.modal.close('cancel');
  }

  delete() {
    const deleteItemSubscr = this[this.item.service][this.item.method]({ ...this.item.payload })
      .subscribe((res: any) => {
        this.showMessage(1, "¡El " + this.item.type + " ha sido inactivado!");
        this.modal.close('success');
      }, err => { this.showMessage(3, err.error.message); throw err; });

    this.unsubscribe.push(deleteItemSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
