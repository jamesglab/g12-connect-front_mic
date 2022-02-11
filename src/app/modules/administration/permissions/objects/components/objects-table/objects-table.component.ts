import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListObject } from '../../../../_models/object.model';
import { EditObjectComponent } from '../edit-object/edit-object.component';
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

  //VALIDAMOS LOS CAMBIOS
  ngOnChanges(changes: SimpleChanges) {
    //VALIDAMOS LA VARIABLE DEL BUSCADOR
    if (changes.search) {
      if (!changes.search.firstChange) {
        this.applyFilter();//APLICAMOS LOS FILTROS
      }
    }
    //VALIDAMOS EL CAMBIO DEL RELOAD
    if (changes.reload) {
      if (changes.reload.currentValue) {
        //RECARGAMOS LA TABLA
        this.getObjects();
      }
    }
  }

  // METODO PARA CONSULTAR LOS PERMISOS DE LA PLATAFORMA
  getObjects() {
    const getObjectsSubscr = this._rolesService
      //CONSUMIMOS EL ENDPOINT DE LOS PERMISOS
      .getPermissions().subscribe((res: any) => {
        //VALIDAMOS SI EXISTE EL DATASOURCE DE ANGULAR MATERIAL
        if (!this.dataSource) {
          //CREAMOS EL DATASOURCE DE ANGULAR MATERIAL
          this.dataSource = new MatTableDataSource<ListObject[]>(res);
          //ANEXAMOS EL PAGINADOR
          this.dataSource.paginator = this.paginator;
        } else {
          //ANEXAMOS LA RESPUESTA A LA DATA DEL DATASOURCE DE ANGULAR MATERIAL
          this.dataSource.data = res;
        }
        this.reloaded.emit(false);
      }, err => { throw err; });
    this.unsubscribe.push(getObjectsSubscr);
  }

  //APLICAMOS FILTRO A LA TABLA DE ANGULAR MATERIAL
  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    //MOSTRAMOS LOS DATOS DE ANGULAR MATERIAL
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  //METODO PARA EDITAR EL PERMISO
  handleEdit(element: ListObject) {
    //CREAMOS EL MODAL Y ABRIMOS EL COMPONENTE DE EditObjectComponent
    const MODAL = this.modalService.open(EditObjectComponent, {
      size: 'sm',//TAMAÑO DEL MODAL
      centered: true//CENTRAMOS EL MODAL
    })
    // ANEXAMOS EL PERMISO A EDITAR A LA VARIABLE 'object' DEL COMPONENTE EditObjectComponent
    MODAL.componentInstance.object = element;
    MODAL.result.then((data) => {
      if (data == "success") {
        // RECARGAMOS LOS PERMISOS
        this.getObjects();
      }
    });
  }

  //ELMINAMOS LAS SUBSCIRPCIONES ABIERTAS
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
