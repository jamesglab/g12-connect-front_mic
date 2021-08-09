import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepicker } from '@angular/material/datepicker';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { MatSnackBar } from '@angular/material/snack-bar';

import { G12eventsService } from '../_services/g12events.service';
import { ExportService } from '../../_services/export.service';
import { EditReportNotPastorComponent } from './components/edit-report-not-pastor/edit-report-not-pastor.component';
import { AddAssistantComponent } from './components/add-assistant/add-assistant.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-users-not-pastor',
  templateUrl: './users-not-pastor.component.html',
  styleUrls: ['./users-not-pastor.component.scss']
})
export class UsersNotPastorComponent implements OnInit {

  public date = new FormControl(moment());
  public maxDate: Date;
  public range = new FormGroup({ init_date: new FormControl(), finish_date: new FormControl() });
  public cutTransactions: any = [];
  public event_selected = new FormControl(0, []);
  public status = new FormControl(0, []);

  // public pastores: { [key:string]: any }[] = [];

  public pastor_selected = new FormControl(0, []);
  public payments_method = new FormControl(0, []);

  public downloadPastor: boolean = false;
  public search = new FormControl('', []);
  public data_cut_table: any;
  public info_users_count: any;
  // public info_to_export: any = [];

  //CRIS
  public getReportForm: FormGroup;
  public isLoading: boolean = false;
  public events: { [key: string]: any }[] = [];
  public dataSource: any;
  public displayedColumns: string[] = ['payment_method', 'reference', 'status', 'identification', 'name', 'last_name', 'email', 'options'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private unsubscribe: Subscription[] = [];

  constructor(private _g12Events: G12eventsService, private cdr: ChangeDetectorRef, private fb: FormBuilder,
    private exportService: ExportService, private snackBar: MatSnackBar, private modalService: NgbModal, private MatDialog: MatDialog) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getEvents();
  }

  buildForm() {
    this.getReportForm = this.fb.group({
      event: [null, [Validators.required]],
      filter: [null, [Validators.required]], //IS FOR FILTER USERS 1-> TODOS 2 -> SIN PASTOR
    })
    this.cdr.detectChanges();
  }

  get form() {
    return this.getReportForm.controls;
  }

  // getPastor() {
  //   this._g12Events.getPastor({ userCode: '01', church: '1' }).subscribe((res) => {
  //     this.pastores = res; }, err => { throw err; });
  // }

  getEvents() {
    this._g12Events.getFilter({ type: "G12_EVENT" }).subscribe((res) => {
      this.events = res || [];
    }, err => { throw err; });
  }

  filter() {
    this.dataSource.filter = this.search.value.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  onSubmit() {
    if (this.getReportForm.invalid) {
      return;
    }
    //FILTER DATAAAA
    // console.log("ANTES DE IRSE", this.getReportForm.getRawValue());
    this.getDataByFilter();
  }

  getDataByFilter() {
    this.isLoading = true;
    this._g12Events.getDataByFilter(this.getReportForm.getRawValue())
      .subscribe((res: any) => {
        // LUEGO DEBO DE REFACTORIZAR
        // this.countUsers(res);
        this.isLoading = false;
        res.map((item, i) => {
          res[i].transaction.status = this.validateStatus(item.transaction.status);
          res[i].transaction.payment_method = this.validatePaymentMethod(item.transaction.payment_method)
        });

        if (!this.dataSource) {
          this.dataSource = new MatTableDataSource<any[]>(this.getObjetcsToTable(res.reverse()));
          // this.info_to_export = res;
          this.cdr.detectChanges();
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource.data = this.getObjetcsToTable(res.reverse());
        }

        this.cutTransactions = [];
        this.data_cut_table = [];
        // this.info_to_export = res;
        this.separateCuts(res);
      }, err => { this.isLoading = false; throw err; })
  }

  getObjetcsToTable(data) {

    let newReports = [];
    data.map(element => {
      const newReport = {
        payment_method: element.transaction.payment_method,
        created_at: element.created_at,
        _id: element._id,
        // event_name: element.donation.name,
        status: element.transaction.status,
        identification: element.user.identification,
        name: element.user.name,
        last_name: element.user.last_name,
        email: element.user.email,
        reference: element.transaction.payment_ref,
        user: { ...element.user },
        church: { ...element.church },
        leader: { ...element.leader },
        pastor: { ...element.pastor }
      }
      newReports.push(newReport);
    });
    return newReports

  }


  handleToEdit(report) {

    const MODAL = this.modalService.open(EditReportNotPastorComponent, {
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.report = report;
    MODAL.result.then((data) => {
      if (data == "success") {
        this.getDataByFilter();
        // this.getTransactionsMongoNotPastor();
      }
    });

  }

  handleAdd() {
    const MODAL = this.modalService.open(AddAssistantComponent, {
      windowClass: 'fadeIn',
      size: 'xl',
      backdrop: true,
      keyboard: true,
      centered: true

    });
    MODAL.result.then((data) => {
      if (data == "success") {
        // this.getDataByFilter();
        // this.getTransactionsMongoNotPastor();
      }
    });
    // MODAL.result.then((data) => {

    // })
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // result.Leader = (result.Leader) ? result.Leader.code : null;
    //     // this.assistantsService.addNewAssistant(result);
    //     this.cdr.detectChanges();
    //   }
    // });
  }
  sendEmail(user) {

    Swal.fire({
      title: 'ENVIAR CORREO DE CONFIRMACIÓN',
      showDenyButton: true,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      text: `Enviaras un correo de confirmación a ${user.email} `,
      confirmButtonText: `Enviar`,
      denyButtonText: `No Enviar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._g12Events.sendEmail({
          name: user.name ? user.name : '',
          fullName: `${user.name ? user.name : ''} ${user.user.last_name ? user.user.last_name : ''}`,
          last_name: user.user?.last_name ? user.user.last_name : '',
          identification: user.user?.identification ? user.user.identification : '',
          sede: user.church?.name ? user.church.name : '',
          pastor: user.pastor?.name ? `${user.pastor.name} ${user.pastor.last_name ? user.pastor.last_name : ''} ` : '',
          leader: user.leader?.name ? `${user.leader.name} ${user.leader.last_name ? user.leader.last_name : ''} ` : '',
          email: user.email ? user.email : ''
        }).subscribe(res => {
          Swal.fire('Correo enviado', '', 'success');
        },err=>{
          Swal.fire('Correo no enviado', '', 'error');

        })
      } else if (result.isDenied) {


      }
    })




    console.log('user to send', user)

  }
  async separateCuts(data) {

    let cutTransaction = {};
    let firstItem = false;
    data.map(transaction => {
      if (!firstItem) {
        cutTransaction[transaction.cut.name] = [transaction];
        firstItem = true;
      } else {
        Object.keys(cutTransaction).map(async (element) => {
          if (element == transaction.cut.name) {
            cutTransaction[element].push(transaction);
          } else {
            cutTransaction[transaction.cut.name] = [transaction]
          }
        });
      }
    });
    this.cutTransactions = cutTransaction;
  }

  // getTransactions() {
  //   if (this.pastor_selected.value.toString() != 0) {
  //     this.downloadPastor = true;
  //   } else {
  //     this.downloadPastor = false;
  //   }
  //   this._g12Events.getTransactionsEvents(
  //     {
  //       filterDates: this.range.getRawValue().finish_date ? JSON.stringify({
  //         init_date: this.range.getRawValue().init_date.format(),
  //         finish_date: this.range.getRawValue().finish_date.format(),
  //       }) : '',
  //       platform: "EVENTOSG12",
  //       event_id: this.event_selected.value.id ? this.event_selected.value.id : null,
  //       status: (this.status.value.toString() != 0) ? this.status.value.toString() : null,
  //       payment_method: this.payments_method.value,
  //       pastor: (this.pastor_selected.value.toString() != 0) ? JSON.stringify({
  //         user_code: this.pastor_selected.value.user_code,
  //         church_id: this.pastor_selected.value.church_id
  //       }) : null
  //     }
  //   ).subscribe(res => {
  //     res.map((item, i) => { res[i].status = this.validateStatus(item.status); res[i].payment_method = this.validatePaymentMethod(item.payment_method) })
  //     if (!this.dataSource) {
  //       this.dataSource = new MatTableDataSource<any[]>(res);
  //       this.cdr.detectChanges();
  //     } else {
  //       this.dataSource.data = res;
  //     }

  //   })
  // }


  // countUsers(data: any[]) {


  //   let aprobe = 0;
  //   let pending = 0;
  //   let cancel = 0;
  //   data.map(item => {
  //     if (item?.transaction?.status?.trim().toLowerCase() == '1') {
  //       aprobe = aprobe + 1;
  //     } else if (item?.transaction?.status?.trim().toLowerCase() == '2') {
  //       pending = pending + 1;
  //     } else if (item?.transaction?.status?.trim().toLowerCase() == '3') {
  //       cancel = cancel + 1;
  //     }
  //   });
  //   const cont_users = {
  //     total: data.length,
  //     aprobe,
  //     pending,
  //     cancel
  //   }
  //   this.info_users_count = cont_users;
  // }


  // exportFile() {
  //   if (this.info_to_export.length > 0) {
  //     const dataToExport = []
  //     this.info_to_export.map(item => {
  //       const newData = {

  //         Nombre: item.user?.name ? item.user.name : 'N/A',
  //         Apellido: item.user?.last_name ? item.user.last_name : 'N/A',
  //         'No. Documento': item.user?.identification ? item.user.identification : 'N/A',
  //         'Fecha Nacimiento': item.user?.birth_date ? new Date(item.user.birth_date) : 'N/A',
  //         Genero: item.user?.gender ? item.user.gender : 'N/A',
  //         Telefono: item.user?.phone ? item.user.phone : 'N/A',
  //         "E-mail": item.user?.email ? item.user.email : 'N/A',
  //         Pais: item.user?.country ? item.user.country : 'N/A',
  //         Departamento: item.user?.departament ? item.user.departament : 'N/A',
  //         Municipio: item.user?.city ? item.user.city : 'N/A',
  //         Sede: item.church?.name ? item.church.name : 'N/A',
  //         Pastor: item.pastor?.name ? item.pastor.name : 'N/A',
  //         'Lider Doce': item.leader?.name ? item.leader.name : 'N/A',
  //         'Fecha de Donación': new Date(item.created_at),
  //         'Referencia Transaccion': item.transaction.payment_ref ? item.transaction.payment_ref : '',
  //         'Metodo de pago': item.transaction.payment_method ? item.transaction.payment_method : '',
  //         'Nombre evento': item.donation?.name ? item.donation?.name : 'N/A',
  //         'Nombre corte': item.cut?.name ? item.cut?.name : 'N/A',
  //         Estado: item.transaction.status ? item.transaction.status : 'N/A',
  //         Costo: item.transaction.currency == 'cop' ? item.cut.prices.cop : item.cut.prices.usd,
  //         Moneda: item.transaction.currency ? item.transaction.currency : 'N/A',

  //       }
  //       dataToExport.push(newData)
  //     });
  //     this.exportService.exportAsExcelFile(dataToExport, 'EVENTOS G12');
  //   } else {
  //     this.showMessage(2, 'No hay datos por exportar');
  //   }
  // }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
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

  validatePaymentMethod(payment_method) {
    if (payment_method.toLowerCase() == 'credit') {
      return 'Tarjeta de credito'
    } else if (payment_method.toLowerCase() == 'pse') {
      return 'PSE'
    } else if (payment_method.toLowerCase() == 'cash') {
      return 'Efectivo'
    } else if (payment_method.toLowerCase() == 'administration') {
      return 'Administración'
    }
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
