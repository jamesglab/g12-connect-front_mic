import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { AdminUsersService } from '../../../../_services/admin-users.service';
import { ListUser } from '../../../../_models/user.model';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { UserRolesComponent } from '../user-roles/user-roles.component';
import { AdminRolesService } from 'src/app/modules/administration/_services/admin-roles.service';
import { AddBoxUserComponent } from '../add-box-user/add-box-user.component';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit {
  @Input() public search: String = '';
  @Output() public endLoading: EventEmitter<boolean> = new EventEmitter();

  private unsubscribe: Subscription[] = [];
  private roles: [] = [];
  private boxes: [] = [];

  public displayedColumns: String[] = [
    'idUser',
    'name',
    'email',
    'country',
    'status',
    'actions',
  ];

  public dataSource: MatTableDataSource<any[]>;
  

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _adminUsersService: AdminUsersService,
    
    private _roleService: AdminRolesService
  ) {}

  ngOnInit(): void {
    this.subscribeToChanges();
    this.getRoles();
    this.getBoxes();
  }

  //NOS SUBSCRIBIMOS A LOS CAMBIOS QUE TENGA EL RELIAD PARA RENDERIZAR LOS USUARIOS
  subscribeToChanges() {
    const subscr = this._adminUsersService.reload.subscribe((res) =>
      this.getUsers()
    );
    //GUARDAMOS LA SUBSCRIPCION
    this.unsubscribe.push(subscr);
  }

  //CONSULTAMOS LOS USUARIOS EL FILTRO SE ENCUENTRA EN EL SERVICIO DE AdminUsersService
  getUsers() {
    const getUserTypesSubscr = this._adminUsersService.getUsers().subscribe(
      (res: any) => {
        if (res[0]) {
          //CREAMOS EL DATASOURCE DE LA TABLA DE ANGULAR MATERIAL
          if (!this.dataSource) {
            //ANEXAMOS EL NUEVO OBJETO DE ANGULAR MATERIAL
            this.dataSource = new MatTableDataSource<ListUser[]>(res);
            //PONEMOS EL PAGINADOR DE ANGULAR MATERIAL
            this.dataSource.paginator = this.paginator;
          } else {
            //ANEXAMOS LA RESPUESTA DE A LA PROPIEDAD DATA DE LA TABLA DE ANGULAR MATERIAL
            this.dataSource.data = res;
          }
        } else {
          //MOSTRAMOS MENSAJE CUANDO NO ENCONTRAMOS USUARIOS
          this.showMessage(3, 'Lo sentimos, no hemos encontrado usuarios.');
        }
        // EMITIMOS EL LOADER EN FALSE=
        this.endLoading.emit(false);
      },
      (err) => {
        throw err;
      }
    );
    this.unsubscribe.push(getUserTypesSubscr);
  }

  //CONSULTAMOS LOS ROLES DISPONIBLES EN LA PLATAFORMA
  getRoles() {
    this._roleService.getRoles().subscribe((res) => {
      //AGRAGAMOS LA RESPUESTA QUE VIENE EN FORMATO ARRAY A LOS ROLES
      this.roles = res;
    });
  }

  //ABRIMOS EL MODAL PARA EL CRUD DE ROLES EN EL USUARIO
  handleAddRole(element: ListUser) {
    //CREAMOS EL MODAL Y ABRIMOS EL COMPONENTE DE UserRolesComponent
    const MODAL = this.modalService.open(UserRolesComponent, {
      size: 'lg', //TAMAÑO DEL MODAL
      centered: true, //CENTRAMOS EL MODAL
    });
    MODAL.componentInstance.user = element; //AGREGAMOS A LA VARIABLE USER DEL COMPONENTE UserRolesComponent EL USUARIO A EDITAR
    MODAL.componentInstance.roles = this.roles; //AGREGAMOS LOS ROLES QUE SE CONSULTARO
    MODAL?.result?.then((data) => {
      //NOS SUBSCRIBIMOS A LA RESPUESTA DE LOS ROLES
      this.getUsers(); //CONSULTAMOS LOS USUARIOS
    });
  }

  //ABRIMOS MODAL PARA EDITAR EL USUARIO
  handleEdit(element: ListUser) {
    //CREAMOS EL MODAL Y ABRIMOS EL COMPONENTE DE EditUserComponent
    const MODAL = this.modalService.open(EditUserComponent, {
      size: 'lg', //TAMAÑO DEL MODAL
      centered: true, //CENTRAMOS EL MODAL
    });
    MODAL.componentInstance.user = element; //AGREGAMOS A LA VARIABLE USER DEL COMPONENTE UserRolesComponent EL USUARIO A EDITAR
    MODAL.result.then((data) => {
      if (data == 'success') {
        this.getUsers();
      }
    });
  }

  handleBox(element) {
    //CREAMOS EL MODAL Y ABRIMOS EL COMPONENTE DE EditUserComponent
    const MODAL = this.modalService.open(AddBoxUserComponent, {
      size: 'md', //TAMAÑO DEL MODAL
      centered: true, //CENTRAMOS EL MODAL
    });
    MODAL.componentInstance.user = element; //AGREGAMOS A LA VARIABLE USER DEL COMPONENTE UserRolesComponent EL USUARIO A EDITAR
    MODAL.componentInstance.boxes = this.boxes; //AGREGAMOS A LA VARIABLE USER DEL COMPONENTE UserRolesComponent EL USUARIO A EDITAR
    MODAL.result.then((data) => {
      if (data == 'success') {
        this.getUsers();
      }
    });
  }

  //MOSTRAMOS MENSAJES
  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(
      NotificationComponent,
      notificationConfig(type, message)
    );
  }

  //CONSULTAMOS LAS CAJAS EN EL SISTEMAS PARA AGREGARLAS A UN USUARIO
  getBoxes() {
    this._adminUsersService.getBoxes({ status: true }).subscribe(
      (res: any) => {
        this.boxes = res;
      },
      (err) => {
        throw err;
      }
    );
  }
  //DESTRUIMOS LAS SUBSCRIPCIONES
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
