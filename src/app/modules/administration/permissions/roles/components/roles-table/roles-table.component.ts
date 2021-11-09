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

  // CONSULTAMOS LOS ROLES
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

  // CONSULTAMOS TODOS LOS PERMISOS DE LA PLATAFORMA
  getAllPermissions() {
    //CONSUMIMOS EL ENDPOINT PARA OBTENER TODOS LOS PERMISOS DE LA PLATAFORMA
    this._adminRolesService.getPermissionsActive().subscribe((res: any) => {
      //AGREGAMOS LA RESPUESTA DE TODOS LOS PERMISOS DE LA PLATAFORMA
      this.allPermissions = res
    })
  }

  // VALIDAMOS LOS CAMBIOS
  ngOnChanges(changes: SimpleChanges) {
    if (changes.search) {
      //SI CAMBIARON LOS FILTROS APLICAMOS EL FILTRO
      if (!changes.search.firstChange) {
        //APLICAMOS LOS FILTROS
        this.applyFilter();
      }
    }
  }

  //NOS SUBSCRIBIMOS A LOS CAMBIOS DEL OUTUPT DEL SERVICIO DEL RELOAD
  subscribeToChanges() {
    const subscr = this._adminRolesService.reload.subscribe((res) => this.getRoles());
    this.unsubscribe.push(subscr);
  }

  //BUSCAMOS EN LA TABLA LOS LOS VALORES A BBUSCAR
  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  // CONSULTAMOS LOS PERMISOS DE LA PLATAFORMA
  getPermissions(element: Role) {
    //CONSUMIMOS EL ENDPOINT QUE NOS RETORNA LOS PERMISOS QUE TIENE UN ROL
    this._adminRolesService.getPermissionsByRole({ id: element.id }).subscribe(res => {
      const MODAL = this.modalService.open(RolesObjectsComponent, {
        size: 'lg',//TAMAÑO DEL MODAL
        centered: true//CENTRAR EL MODAL
      })
      MODAL.componentInstance.role = res;//AGRREGAMOS EL ROL A LA RESPUESTA
      MODAL.componentInstance.allPermissions = this.allPermissions; //ANEXAMOS TODOS LOS PERMISOS DE LA PLATAFORMA 
      MODAL.result.then((data) => {
        if (data == "success") { this.getRoles() }
      });
    })
  }

  // EDITAREMOS UN ROL
  handleEdit(element: Role) {
    //CREAMOS MODAL Y ABRIMOS EL COMPONENTE DE EDITAR UN ROL
    const MODAL = this.modalService.open(EditRoleComponent, {
      size: 'sm',//TAMAÑO DEL MODAL
      centered: true//MODAL CENTRADO
    })
    MODAL.componentInstance.role = element;//AGREGAMOS A LA VARIABLE 'rol' EL ROL A EDITAR
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getRoles();
      }
    });
  }

  //ELIMINAMOS LAS SUBSCRIPCIONES
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
