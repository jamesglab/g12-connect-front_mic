import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminUsersService } from '../../_services/admin-users.service';
import { CreateBoxComponent } from '../create-box/create-box.component';
import { EditBoxComponent } from '../edit-box/edit-box.component';

@Component({
  selector: 'app-boxes-table',
  templateUrl: './boxes-table.component.html',
  styleUrls: ['./boxes-table.component.scss'],
})
export class BoxesTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public dataSource: MatTableDataSource<any>;
  public permissions = this.storageSevice.getItem('permissions')
  displayedColumns: string[] = ['name', 'user', 'email', 'status', 'options'];
  

  constructor(
    public adminService: AdminUsersService,
    public cdr: ChangeDetectorRef,
    private storageSevice : StorageService,
    public modal: NgbModal,

  ) {}

  ngOnInit(): void {
    this.getBoxes();
    
  }

  getBoxes() {
    //CONSULTAMOS LAS CAJAS Y NO ENVIAMOS NINGUN PARAMETRO POR EL QUERY PARAMS PARA TRAERLOS TODOS
    this.adminService.getBoxes().subscribe((res: any) => {
      //VALIDAMOS SI YA SE CREO EL DATASOUTCE DE LA TABLA DE ANGULAR MATERIAL
      if (this.dataSource) {
        //ASIGNAMOS LOS DATOS A LA TABLA
        this.dataSource.data = res;
      } else {
        this.dataSource = new MatTableDataSource<any>(res);
      }
      //SETEAMOS EL PAGINADOR
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    });
  }

  handleEdit(element) {
    //ABRIMOS MODAL PARA EDITAR LA CAJA
    const modalEditBox = this.modal.open(EditBoxComponent, {
      centered: true,
      size: 'md',
    });
    modalEditBox.componentInstance.box = element;
    modalEditBox.result.then((res) => {
      if (res) {
        this.getBoxes();
      }
    });
  }

  handleCreateBox(){
     //ABRIMOS MODAL PARA EDITAR LA CAJA
     const modalEditBox = this.modal.open(CreateBoxComponent, {
      centered: true,
      size: 'md',
    });
    modalEditBox.result.then((res) => {
      if (res) {
        this.getBoxes();
      }
    });
  }
}
