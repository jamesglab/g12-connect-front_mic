import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminRolesService } from '../../../../_services/admin-roles.service';
import { Role } from '../../../../_models/role.model';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { RolesObjectsComponent } from '../roles-objects/roles-objects.component';

@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.scss']
})
export class RolesTableComponent implements OnInit {

  @Input() public search: String = "";
  public isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  public displayedColumns: String[] = ['idRole', 'name', 'description', 'status', 'actions'];
  public dataSource: MatTableDataSource<any[]>;
  public allPermissions: [] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal,
    private _adminRolesService: AdminRolesService) { }

  ngOnInit(): void {
    this.getRoles();
    this.subscribeToChanges();
    this.getAllPermissions();
  }

  getAllPermissions() {
    this._adminRolesService.getPermissionsActive().subscribe((res: any) => {
      this.allPermissions = res
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.search) {
      if (!changes.search.firstChange) {
        this.applyFilter();
      }
    }
  }

  subscribeToChanges() {
    const subscr = this._adminRolesService.reload.subscribe((res) => this.getRoles());
    this.unsubscribe.push(subscr);
  }

  getRoles() {
    const getRoleSubscr = this._adminRolesService
      .getRoles().subscribe((res: any) => {
        if (!this.dataSource) {
          this.dataSource = new MatTableDataSource<Role[]>(res);
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource.data = res;
        }
      }, err => { throw err; });
    this.unsubscribe.push(getRoleSubscr);
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  getPermissions(element: Role) {
    this._adminRolesService.getPermissionsByRole({ id: element.id }).subscribe(res => {
      const MODAL = this.modalService.open(RolesObjectsComponent, {
        windowClass: 'fadeIn',
        size: 'lg',
        backdrop: true,
        keyboard: true,
        centered: true
      })
      MODAL.componentInstance.role = res;
      MODAL.componentInstance.allPermissions = this.allPermissions;

      MODAL.result.then((data) => {
        if (data == "success") { this.getRoles() }
      });
    })

  }

  handleEdit(element: Role) {
    const MODAL = this.modalService.open(EditRoleComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.role = element;
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getRoles();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
