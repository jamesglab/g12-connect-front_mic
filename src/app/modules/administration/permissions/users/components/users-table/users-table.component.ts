import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminUsersService } from '../../../../_services/admin-users.service';
import { Response } from 'src/app/modules/auth/_models/auth.model';
import { ListUser, User } from '../../../../_models/user.model';

import { EditUserComponent } from '../edit-user/edit-user.component';
import { UserObjectsComponent } from '../user-objects/user-objects.component';
import { UserRolesComponent } from '../user-roles/user-roles.component';
import { DeleteItemComponent } from '../../../delete-item/delete-item.component';
import { AdminRolesService } from 'src/app/modules/administration/_services/admin-roles.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");

  @Input() public search: String = "";
  @Output() public endLoading: EventEmitter<boolean> = new EventEmitter();

  // public isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  private roles: [] = [];

  public displayedColumns: String[] = ['idUser', 'name', 'email', 'country', 'status', 'actions'];
  public dataSource: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal, private snackBar: MatSnackBar,
    private _adminUsersService: AdminUsersService, private _roleService: AdminRolesService, private _storageService: StorageService) { }

  ngOnInit(): void {
    // this.getUsers();
    this.subscribeToChanges();
    this.getRoles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.search) {
      if (!changes.search.firstChange) {
        this.applyFilter();
      }
    }
  }

  subscribeToChanges() {
    const subscr = this._adminUsersService.reload.subscribe((res) => this.getUsers());
    this.unsubscribe.push(subscr);
  }

  getUsers() {
    const getUserTypesSubscr = this._adminUsersService
      .getUsers().subscribe((res: any) => {
        if (res[0]) {
          res.reverse();
          if (!this.dataSource) {
            this.dataSource = new MatTableDataSource<ListUser[]>(res);
            this.dataSource.paginator = this.paginator;
          } else {
            this.dataSource.data = res;
          }
        } else {
          this.showMessage(3, "Lo sentimos, no hemos encontrado usuarios.")
        }
        this.endLoading.emit(false);
      }, err => { throw err; });
    this.unsubscribe.push(getUserTypesSubscr);
  }

  getRoles() {
    this._roleService.getRoles().subscribe(res => {
      this.roles = res;
    })
  }
  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  handleAddRole(element: ListUser) {
    const MODAL = this.modalService.open(UserRolesComponent, {
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.user = element;
    MODAL.componentInstance.roles = this.roles;
    MODAL.result.then((data) => {
      if (data == "success") { }
    });
  }

  handleEdit(element: ListUser) {
    const MODAL = this.modalService.open(EditUserComponent, {
      windowClass: 'fadeIn',
      size: 'xl',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.user = element;
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getUsers();
      }
    });
  }

  handleClose(element: ListUser) {
    const MODAL = this.modalService.open(DeleteItemComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.item = {
      type: "usuario", method: "deleteUser", service: "_adminUsersService",
      payload: { id: element.id }
    }
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getUsers();
      }
    }, err => { });
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
