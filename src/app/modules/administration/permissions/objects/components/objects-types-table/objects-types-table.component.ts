import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminObjectsService } from '../../../../_services/admin-objects.service';
import { Response } from 'src/app/modules/auth/_models/auth.model';
import { ObjectType } from '../../../../_models/object.model';

import { EditObjectTypeComponent } from '../edit-object-type/edit-object-type.component';
import { DeleteItemComponent } from '../../../delete-item/delete-item.component';

@Component({
  selector: 'app-objects-types-table',
  templateUrl: './objects-types-table.component.html',
  styleUrls: ['./objects-types-table.component.scss']
})
export class ObjectsTypesTableComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");

  @Input() public search: String = "";
  @Input() public reload: boolean = null;
  @Output() public reloaded: EventEmitter<Boolean> = new EventEmitter();

  public isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  
  public displayedColumns: String[] = ['idType', 'name', 'description', 'disposable', 'actions'];
  public dataSource: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal, private _adminObjectsService: AdminObjectsService,
    private _storageService: StorageService) { }

  ngOnInit(): void {
    this.getObjectsTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.search){
      if (!changes.search.firstChange) {
        this.applyFilter();
      }
    }
    if(changes.reload){
      this.getObjectsTypes();
    }
  }

  getObjectsTypes() {
    // const getUserTypesSubscr = this._adminObjectsService
    //   .getObjectTypes().subscribe((res: Response) => {
    //     if (res.result) {
    //       res.entity.reverse();
    //       if(!this.dataSource){ 
    //         this.dataSource = new MatTableDataSource<ObjectType[]>(res.entity);
    //         this.dataSource.paginator = this.paginator;
    //       }else{
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

  handleEdit(element: ObjectType) {
    const MODAL = this.modalService.open(EditObjectTypeComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    console.log("OBJECTTTT TYPEEE", element);
    MODAL.componentInstance.objectType = element;
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getObjectsTypes();
      }
    });
  }

  handleClose(element: ObjectType) {
    const MODAL = this.modalService.open(DeleteItemComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.item = {
      type: "tipo de objeto", method: "deleteObjectType", service: "_adminObjectsService",
      payload: { IdTypeObject: element.id, UserModified: this.currentUser.idUser }
    }
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getObjectsTypes();
      }
    }, err => { });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
