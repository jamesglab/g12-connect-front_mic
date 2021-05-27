import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminUsersService } from '../../../../_services/admin-users.service';
import { Response } from 'src/app/modules/auth/_models/auth.model';
import { ListUser, User } from '../../../../_models/user.model';

import { EditUserComponent } from '../edit-user/edit-user.component';
import { UserObjectsComponent } from '../user-objects/user-objects.component';
import { UserRolesComponent } from '../user-roles/user-roles.component';
import { DeleteItemComponent } from '../../../delete-item/delete-item.component';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");

  @Input() public search: String = "";
  @Input() public reload: boolean = false;
  @Output() public reloaded: EventEmitter<Boolean> = new EventEmitter();

  public isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  public displayedColumns: String[] = ['idUser', 'name', 'nickName', 'typeuser', 'disposable', 'actions'];
  public dataSource: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal, private _adminUsersService: AdminUsersService,
    private _storageService: StorageService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.search) {
      if (!changes.search.firstChange) {
        this.applyFilter();
      }
    }
    if (changes.reload) {
      if (changes.reload.currentValue) {
        this.getUsers();
      }
    }
  }

  getUsers() {
    const getUserTypesSubscr = this._adminUsersService
      .getUsers().subscribe((res: Response) => {
        if (res.result) {
          res.entity.reverse();
          if (!this.dataSource) {
            this.dataSource = new MatTableDataSource<ListUser[]>(res.entity);
            this.dataSource.paginator = this.paginator;
          } else {
            this.dataSource.data = res.entity;
          }
          this.reloaded.emit(false);
        }
      }, err => { throw err; });
    this.unsubscribe.push(getUserTypesSubscr);
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  handleAddObjects(element: ListUser) {
    const MODAL = this.modalService.open(UserObjectsComponent, {
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.user = element;
    MODAL.result.then((data) => {
      if (data == "success") {}
    });
  }

  handleAddRole(element: ListUser){
    const MODAL = this.modalService.open(UserRolesComponent, {
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.user = element;
    MODAL.result.then((data) => {
      if (data == "success") {}
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
      payload: { IdUser: element.idUser, UserModified: this.currentUser.idUser }
    }
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getUsers();
      }
    }, err => { });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
