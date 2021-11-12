import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { StorageService } from '../../auth/_services/storage.service';
import { UserService } from '../../_services/user.service';
import { AddUserMassiveComponent } from './components/add-user/add-user.component';
import { ProofPaymentComponent } from './components/proof-payment/proof-payment.component';



const ELEMENT_DATA = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
]

@Component({
  selector: 'app-massive-table',
  templateUrl: './massive-table.component.html',
  styleUrls: ['./massive-table.component.scss']
})

export class MassiveTableComponent implements OnInit {

  ELEMENT_DATA = ELEMENT_DATA
  private currentUser = this.storageService.getItem('auth').user;
  public leaders: [] = [];
  public displayedColumns: string[] = ['event', 'quantity', 'cut', 'status', 'detail'];
  public dataSource: MatTableDataSource<any[]>;;
  public permissions: any;
  public search = new FormControl('');
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private modalService: NgbModal, private storageService: StorageService,
    private userService: UserService, private asideMenuService: DynamicAsideMenuService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getLeaders();
    this.getPermissions();
    this.getMassives()
  }

  //CONSULTAMOS LOS PERMISOS QUE PUEDE TENER UN USUARIO
  getPermissions() {
    this.asideMenuService.getPermissionsUser().subscribe(res => {
      this.permissions = res;
      this.cdr.detectChanges();
    });
  }

  // CONSULTAMOS LOS LIDERES QUE PERTENECEN A LA RED DEL PASTOR
  getLeaders() {
    this.userService.getLeadersOrPastors({ userCode: this.currentUser.user_code, church: this.currentUser.church_id }).subscribe(res => {
      this.leaders = res;
    })
  }

  // CONSULTAMOS LOS MASIVOS DEL USUARIO
  getMassives() {
    //ANEXAMOS EL NUEVO OBJETO DE ANGULAR MATERIAL
    this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
    //PONEMOS EL PAGINADOR DE ANGULAR MATERIAL
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.dataSource.filter = this.search.value.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  //ABRIREMOS EL MODAL PARA CAGREGAR UN USUARIO
  addUser() {
    //CREAMOE EL MODAL Y ABRIMOS EL COMPONENTE DE EditEventComponent
    const MODAL = this.modalService.open(AddUserMassiveComponent, {
      size: 'lg',//TAMAÑO DEL MODAL
      centered: true// CENTRAMOS EL MODAL
    })
    MODAL.componentInstance.leaders = this.leaders;
    MODAL.result.then((data) => { //CONSULTAMOS LA RESPUESTA DEL MODAL
      if (data == "success") {//SI LA DATA ES SUCCESS
      }
    });
  }

  proofPayment(){
        //CREAMOE EL MODAL Y ABRIMOS EL COMPONENTE DE ProofPaymentComponent
        const MODAL = this.modalService.open(ProofPaymentComponent, {
          size: 'xl',//TAMAÑO DEL MODAL
          centered: true// CENTRAMOS EL MODAL
        });
        MODAL.result.then((data) => { //CONSULTAMOS LA RESPUESTA DEL MODAL
          if (data == "success") {//SI LA DATA ES SUCCESS
          }
        });
  }

  showTicket() {

  }
}
