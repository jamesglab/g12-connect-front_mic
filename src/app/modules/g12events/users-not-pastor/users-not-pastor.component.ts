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
import { ChangueEventUserComponent } from './components/changue-event-user/changue-event-user.component';
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
  public validate_type_filter: any;
  // public info_to_export: any = [];

  //CRIS
  public getReportForm: FormGroup;
  public isLoading: boolean = false;
  public events: { [key: string]: any }[] = [];
  public dataSource: any;
  public count;

  public displayedColumns: string[] = ['event', 'payment_method', 'reference', 'status', 'identification', 'name', 'last_name',  'email', 'assistant', 'options'];
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
      event: [null],
      filter: ['3'], //IS FOR FILTER USERS 1-> TODOS 2 -> SIN PASTOR
    });
    this.getDataByFilter();
    this.cdr.detectChanges();
  }

  get form() {
    return this.getReportForm.controls;
  }

  getEvents() {
    this._g12Events.getAll({ type: "G12_EVENT" }).subscribe((res) => {
      this.events = res || [];
    }, err => { throw err; });
  }

  filter(pagination) {

    this._g12Events.getDataByFilterValue({
      ...this.getReportForm.getRawValue(),
      value_filter: this.search.value.trim().toLowerCase(),
      page: pagination ? pagination.pageIndex + 1 : 1, per_page: pagination ? pagination.pageSize : 10

    }).subscribe((res: any) => {
      this.isLoading = false;
      this.count = res.count;
      res.transactions.map((item, i) => {
        res.transactions[i].transaction.status = this.validateStatus(item.transaction.status);
        res.transactions[i].transaction.payment_method = this.validatePaymentMethod(item.transaction.payment_method)
      });

      if (!this.dataSource) {
        this.dataSource = new MatTableDataSource<any[]>(this.getObjetcsToTable(res.transactions));
        this.cdr.detectChanges();
      } else {
        this.dataSource.data = this.getObjetcsToTable(res.transactions);
      }

      this.cutTransactions = [];
      this.data_cut_table = [];
    }, err => { this.isLoading = false; throw err; })

  }

  onSubmit(paginator?) {
    if (this.getReportForm.invalid) {
      Swal.fire('Campos Incompletos', '', 'warning')
      return;
    }
    if (!paginator) {
      this.paginator.pageIndex = 0;
    }
    if (this.search.value != '') {
      if (!this.validate_type_filter) {
        this.validate_type_filter = true;
        this.paginator.pageIndex = 0;
      }
      this.filter(this.paginator);

    } else {
      if (this.validate_type_filter) {
        this.validate_type_filter = false;
        this.paginator.pageIndex = 0;
      }
      this.getDataByFilter(this.paginator);
    }
  }

  getDataByFilter(pagination?) {
    this.paginator = pagination;
    this.isLoading = true;
    this._g12Events.getDataByFilter({ ...this.getReportForm.getRawValue(), page: pagination ? pagination.pageIndex + 1 : 1, per_page: pagination ? pagination.pageSize : 10 })
      .subscribe((res: any) => {
        this.isLoading = false;
        this.count = res.count;
        res.transactions.map((item, i) => {
          res.transactions[i].transaction.status = this.validateStatus(item.transaction.status);
          res.transactions[i].transaction.payment_method = this.validatePaymentMethod(item.transaction.payment_method)
        });
        if (!this.dataSource) {
          this.dataSource = new MatTableDataSource<any[]>(this.getObjetcsToTable(res.transactions));
          this.cdr.detectChanges();
        } else {
          this.dataSource.data = this.getObjetcsToTable(res.transactions);
        }
        this.cutTransactions = [];
        this.data_cut_table = [];
      }, err => { this.isLoading = false; throw err; })
  }

  getObjetcsToTable(data) {

    let newReports = [];
    data.map(element => {
      const newReport = {
        donation : element?.donation,
        cut : element?.cut,
        isAssistant :element.isAssistant,
        transaction : element.transaction,
        payment_method: element?.transaction?.payment_method,
        created_at: element?.created_at,
        _id: element?._id,
        status: element?.transaction?.status,
        identification: element?.user?.identification,
        name: element?.user?.name,
        last_name: element?.user?.last_name,
        event: element?.donation?.name,
        email: element?.user?.email,
        reference: element?.transaction?.payment_ref,
        user: { ...element?.user },
        church: { ...element?.church },
        leader: { ...element?.leader },
        pastor: { ...element?.pastor }
      }
      newReports.push(newReport);
    });
    return newReports

  }


  handleToChangueEvent(report){
    const MODAL = this.modalService.open(ChangueEventUserComponent, {
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.report = report;
    MODAL.componentInstance.events = this.events;
    MODAL.result.then((data) => {
      if (data){
        this.onSubmit();
      }
    });
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
        this.onSubmit()
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

      }
    });

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
        }, err => {
          Swal.fire('Correo no enviado', '', 'error');

        })
      } else if (result.isDenied) {


      }
    });
  }


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
