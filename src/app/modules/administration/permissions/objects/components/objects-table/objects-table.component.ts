import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { ListObject } from '../../../../_models/object.model';

import { EditObjectComponent } from '../edit-object/edit-object.component';
import { DeleteItemComponent } from '../../../delete-item/delete-item.component';
import { AdminRolesService } from 'src/app/modules/administration/_services/admin-roles.service';

@Component({
  selector: 'app-objects-table',
  templateUrl: './objects-table.component.html',
  styleUrls: ['./objects-table.component.scss']
})
export class ObjectsTableComponent implements OnInit {


  @Input() public search: String = "";
  @Input() public reload: boolean = null;
  @Output() public reloaded: EventEmitter<Boolean> = new EventEmitter();

  public isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  public displayedColumns: String[] = ['idObject', 'value', 'description', 'status', 'actions'];
  public dataSource: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal, private _rolesService: AdminRolesService) { }

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
    const getObjectsSubscr = this._rolesService
      .getPermissions().subscribe((res: any) => {
          if (!this.dataSource) {
            this.dataSource = new MatTableDataSource<ListObject[]>(res);
            this.dataSource.paginator = this.paginator;
          } else {
            this.dataSource.data = res;
          }
          this.reloaded.emit(false);

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
 ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
