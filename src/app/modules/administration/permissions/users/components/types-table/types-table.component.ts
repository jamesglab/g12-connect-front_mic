import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminUsersService } from '../../../../_services/admin-users.service';
import { Response } from 'src/app/modules/auth/_models/auth.model';
import { UserType } from '../../../../_models/user.model';

import { EditUserTypeComponent } from '../edit-user-type/edit-user-type.component';
import { DeleteItemComponent } from '../../../delete-item/delete-item.component';

@Component({
  selector: 'app-types-table',
  templateUrl: './types-table.component.html',
  styleUrls: ['./types-table.component.scss']
})
export class TypesTableComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");

  @Input() public search: String = "";
  @Input() public reload: boolean = null;
  @Output() public reloaded: EventEmitter<Boolean> = new EventEmitter();

  public isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  public displayedColumns: String[] = ['idType', 'name', 'description', 'available', 'actions'];
  public dataSource: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal, private _adminUsersService: AdminUsersService,
    private _storageService: StorageService) { }

  ngOnInit(): void {
    this.getUserTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.search) {
      if (!changes.search.firstChange) {
        this.applyFilter();
      }
    }
    if (changes.reload) {
      this.getUserTypes();
    }
  }

  getUserTypes() {
    // const getUserTypesSubscr = this._adminUsersService
    //   .getUserTypes().subscribe((res: Response) => {
    //     if (res.result) {
    //       res.entity.reverse();
    //       if (!this.dataSource) {
    //         this.dataSource = new MatTableDataSource<UserType[]>(res.entity);
    //         this.dataSource.paginator = this.paginator;
    //       } else {
    //         this.dataSource.data = res.entity;
    //       }
    //       this.reloaded.emit(false);
    //     }
    //   }, err => { throw err; });
    // this.unsubscribe.push(getUserTypesSubscr);
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  // handleEdit(element: Go) {
  handleEdit(element: UserType) {
    const MODAL = this.modalService.open(EditUserTypeComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.userType = element;
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getUserTypes();
      }
    });
  }

  handleClose(element: UserType) { 
    const MODAL = this.modalService.open(DeleteItemComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.item = {
      type: "tipo de usuario", method: "deleteUserType", service: "_adminUsersService",
      payload: { IdTypeUser: element.idType, UserModified: this.currentUser.idUser }
    }
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getUserTypes();
      }
    }, err => { });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
