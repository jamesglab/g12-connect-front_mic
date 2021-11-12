import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { StorageService } from '../../auth/_services/storage.service';
import { UserService } from '../../_services/user.service';
import { G12eventsService } from '../_services/g12events.service';
import { AddUserMassiveComponent } from './components/add-user/add-user.component';
import { ProofPaymentComponent } from './components/proof-payment/proof-payment.component';


@Component({
  selector: 'app-massive-table',
  templateUrl: './massive-table.component.html',
  styleUrls: ['./massive-table.component.scss']
})

export class MassiveTableComponent implements OnInit {

  private currentUser = this.storageService.getItem('auth').user;
  public leaders: [] = [];
  public displayedColumns: string[] = ['event', 'quantity_tickets', 'availability_tickets', 'cut', 'status', 'detail'];
  public dataSource: MatTableDataSource<any[]>;;
  public permissions: any;
  public search = new FormControl('');
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private modalService: NgbModal, private storageService: StorageService, private g12EventService: G12eventsService,
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
    this.g12EventService.getMassives().subscribe(res => {
      this.dataSource = new MatTableDataSource<any>(res);
      this.dataSource.paginator = this.paginator;

    })
    // this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
    //PONEMOS EL PAGINADOR DE ANGULAR MATERIAL
  }

  applyFilter() {
    this.dataSource.filter = this.search.value.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  //ABRIREMOS EL MODAL PARA CAGREGAR UN USUARIO
  addUser(transaction, i) {
    //CREAMOE EL MODAL Y ABRIMOS EL COMPONENTE DE EditEventComponent
    const MODAL = this.modalService.open(AddUserMassiveComponent, {
      size: 'lg',//TAMAÑO DEL MODAL
      centered: true// CENTRAMOS EL MODAL
    })
    MODAL.componentInstance.leaders = this.leaders;
    MODAL.componentInstance.transaction = transaction;
    MODAL.result.then((data) => { //CONSULTAMOS LA RESPUESTA DEL MODAL
      if (data) {//
        this.getMassives();
      }
    });
  }

  proofPayment(proof) {
    //CREAMOE EL MODAL Y ABRIMOS EL COMPONENTE DE ProofPaymentComponent
    const MODAL = this.modalService.open(ProofPaymentComponent, {
      size: 'md',//TAMAÑO DEL MODAL
      centered: true// CENTRAMOS EL MODAL
    });
    MODAL.componentInstance.proof = proof
    MODAL.result.then((data) => { //CONSULTAMOS LA RESPUESTA DEL MODAL
      if (data == "success") {//SI LA DATA ES SUCCESS
      }
    });
  }

  validateStatus(status) {
    if (parseInt(status) == 1) {
      return 'Aprobado'
    } else if (parseInt(status) == 2) {
      return 'En proceso'
    } else if (parseInt(status) == 3) {
      return 'Cancelado/Declinado'
    }
  }

}
