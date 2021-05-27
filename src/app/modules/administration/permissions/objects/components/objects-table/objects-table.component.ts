import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminObjectsService } from '../../../../_services/admin-objects.service';
import { Response } from 'src/app/modules/auth/_models/auth.model';
import { ListObject } from '../../../../_models/object.model';

import { EditObjectComponent } from '../edit-object/edit-object.component';
import { DeleteItemComponent } from '../../../delete-item/delete-item.component';

@Component({
  selector: 'app-objects-table',
  templateUrl: './objects-table.component.html',
  styleUrls: ['./objects-table.component.scss']
})
export class ObjectsTableComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");

  @Input() public search: String = "";
  @Input() public reload: boolean = null;
  @Output() public reloaded: EventEmitter<Boolean> = new EventEmitter();

  public isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  public displayedColumns: String[] = ['idObject', 'name', 'objectType', 'description', 'disposable', 'actions'];
  public dataSource: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal, private _adminObjectsService: AdminObjectsService,
    private _storageService: StorageService) { }

  ngOnInit(): void {
    this.getObjects();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.search) {
      if (!changes.search.firstChange) {
        this.applyFilter();
      }
    }
    if (changes.reload) {
      if (changes.reload.currentValue) {
        this.getObjects();
      }
    }
  }

  getObjects() {
    const getObjectsSubscr = this._adminObjectsService
      .getObjects().subscribe((res: Response) => {
        if (res.result) {
          res.entity.reverse();
          if (!this.dataSource) {
            this.dataSource = new MatTableDataSource<ListObject[]>(res.entity);
            this.dataSource.paginator = this.paginator;
          } else {
            this.dataSource.data = res.entity;
          }
          this.reloaded.emit(false);
        }
      }, err => { throw err; });
    this.unsubscribe.push(getObjectsSubscr);
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  handleEdit(element: ListObject) {
    const MODAL = this.modalService.open(EditObjectComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    console.log("OBJECTTTT", element);
    MODAL.componentInstance.object = element;
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getObjects();
      }
    });
  }

  handleClose(element: ListObject) {
    const MODAL = this.modalService.open(DeleteItemComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.item = {
      type: "objeto", method: "deleteObject", service: "_adminObjectsService",
      payload: { IdObject: element.id, UserModified: this.currentUser.idUser }
    }
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getObjects();
      }
    }, err => { });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
