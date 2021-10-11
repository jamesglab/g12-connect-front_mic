import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from 'src/app/modules/_services/export.service'
import { G12eventsService } from '../_services/g12events.service';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import Swal from 'sweetalert2';


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
@Component({
  selector: 'app-event-reports',
  templateUrl: './event-reports.component.html',
  styleUrls: ['./event-reports.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ]
})


export class EventReportsComponent implements OnInit {
  public isLoading: boolean = false;
  public date = new FormControl(moment());
  public maxDate: Date;
  public campaignOne: FormGroup;
  public campaignTwo: FormGroup;
  public range = new FormGroup({ init_date: new FormControl(), finish_date: new FormControl() });
  public events: [] = [];
  public cutTransactions: any;
  public event_selected = new FormControl(0, []);
  public status = new FormControl(0, []);
  public pastores: any = [];
  public pastor_selected = new FormControl(0, []);
  public payments_method = new FormControl(0, []);
  public displayedColumns: string[] = ['created_at', 'event', 'status', 'identification', 'name', 'last_name', 'email'];
  public dataSource: any;
  public downloadPastor: boolean = false;
  public search = new FormControl('', []);
  public data_cut_table: any;
  public info_users_count: any;
  public info_to_export: any = [];
  constructor(private _g12Events: G12eventsService, private cdr: ChangeDetectorRef, private exportService: ExportService, private snackBar: MatSnackBar,) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {

    this.getEvents();
    this.getPastor();
  }

  getPastor() {
    this._g12Events.getLeadersOrPastors({ userCode: '01', church: '1' }).subscribe(res => {
      this.pastores = res;
    });

  }
  getEvents() {

    this._g12Events.getAll({ type: "G12_EVENT" }).subscribe(res => {
      this.events = res;
    })
  }
  filter() {
    this.dataSource.filter = this.search.value.trim().toLowerCase();
  }

  getTransactionsMongo() {

    this.isLoading = true;
    this._g12Events.getTransactionsReports({
      date_init: `${moment(this.date.value).format('YYYY')}-01-01T00:00:00.000`,
      date_finish: `${moment(this.date.value).format('YYYY')}-12-31T23:59:00.000`,
      platform: "EVENTOSG12",
      event_id: (this.event_selected.value != 0) ? this.event_selected.value.id : '',
      transaction_status: (this.status.value != 0) ? this.status.value : '',
      pastor: (this.pastor_selected.value != 0) ? this.pastor_selected.value.user_code : ''
    }).subscribe((res: any) => {
      this.isLoading = false;
      this.countUsers(res);
      res.map((item, i) => {
        res[i].transaction.status = this.validateStatus(item.transaction.status); res[i].transaction.payment_method = this.validatePaymentMethod(item.transaction.payment_method)
      })

      if (!this.dataSource) {
        this.dataSource = new MatTableDataSource<any[]>(this.getObjetcsToTable(res.reverse()));
        this.info_to_export = res;
        this.cdr.detectChanges();
      } else {

        this.dataSource.data = this.getObjetcsToTable(res.reverse());
      }
      this.data_cut_table = [];
      this.info_to_export = res;
      this.separateCuts(res);
    }, err => {
      this.isLoading = false;
      Swal.fire('Error', 'no pudimos cargar los reportes vuelve a intenterlo mas tarde', 'error')
    })
  }

  getObjetcsToTable(data) {

    let newReports = [];
    data.map(element => {
      const newReport = {
        payment_method: element.transaction.payment_method,
        created_at: element.created_at,
        // event_name: element.donation.name,
        status: element.transaction.status,
        identification: element.user.identification,
        name: element.user.name,
        last_name: element.user.last_name,
        email: element.user.email,
        reference: element.transaction.payment_ref,
        // sede: element.church.name,
        // pastor: element.pastor.name,
      }
      newReports.push(newReport);
    });
    return newReports

  }

  async separateCuts(data) {
    //VALIDAMOS EL QUE SE SELECCIONE UN CORTE
    if (this.event_selected.value) {
      this.cutTransactions = [];
      let cutTransaction = {};
      data.map((transaction, i) => {
        // VALIDAMOS QUE EXISTA EL CORTE EN EL OBJETO CUTTRANSACTIONS
        if (cutTransaction[transaction.cut.name.trim().replace(' ', '')]) {
          // PUSHEAMOS AL ARREGLO
          cutTransaction[transaction.cut.name.trim().replace(' ', '')].push(transaction);
        } else {
          // SI NO EXISTE CREAMOS UN ARRAY EN LA POSICION
          cutTransaction[`${transaction.cut.name.trim().replace(' ', '')}`] = [transaction];
        }
        //VALIDAMOS EL ULTIMO RECORRIDO Y PUSHEAMOS
        if (i == (data.length - 1)) {
          this.cutTransactions = cutTransaction;
        }
      });
    } else {
      this.cutTransactions = null;
    }

  }

  getTransactions() {
    if (this.pastor_selected.value.toString() != 0) {
      this.downloadPastor = true;
    } else {
      this.downloadPastor = false;
    }
    this._g12Events.getTransactionsEvents(
      {
        filterDates: this.range.getRawValue().finish_date ? JSON.stringify({
          init_date: this.range.getRawValue().init_date.format(),
          finish_date: this.range.getRawValue().finish_date.format(),
        }) : '',
        platform: "EVENTOSG12",
        event_id: this.event_selected.value.id ? this.event_selected.value.id : null,
        status: (this.status.value.toString() != 0) ? this.status.value.toString() : null,
        payment_method: this.payments_method.value,
        pastor: (this.pastor_selected.value.toString() != 0) ? JSON.stringify({
          user_code: this.pastor_selected.value.user_code,
          church_id: this.pastor_selected.value.church_id
        }) : null
      }
    ).subscribe(res => {
      console.log('res', res)
      res.map((item, i) => { res[i].status = this.validateStatus(item.status); res[i].payment_method = this.validatePaymentMethod(item.payment_method) })
      if (!this.dataSource) {
        this.dataSource = new MatTableDataSource<any[]>(res);
        this.cdr.detectChanges();
      } else {
        this.dataSource.data = res;
      }

    })
  }

  countUsers(data: any[]) {


    let aprobe = 0;
    let pending = 0;
    let cancel = 0;
    data.map(item => {
      if (item?.transaction?.status?.trim().toLowerCase() == '1') {
        aprobe = aprobe + 1;
      } else if (item?.transaction?.status?.trim().toLowerCase() == '2') {
        pending = pending + 1;
      } else if (item?.transaction?.status?.trim().toLowerCase() == '3') {
        cancel = cancel + 1;
      }
    });
    const cont_users = {
      total: data.length,
      aprobe,
      pending,
      cancel
    }
    this.info_users_count = cont_users;



    // SHOW DATA INTERNATIONAL
    // let nationals = 0;
    // let internationals = 0;
    // data.map(item => {
    //   if (item?.user?.country?.trim().toLowerCase() == 'colombia') {
    //     nationals = nationals + 1;
    //   } else {
    //     internationals = internationals + 1;
    //   }
    // });
    // const cont_users = {
    //   total: data.length,
    //   nationals,
    //   internationals
    // }
    // this.info_users_count = cont_users
  }
  exportFile() {
    if (this.info_to_export.length > 0) {

      const dataToExport = []
      this.info_to_export.map(item => {
        const newData = {
          //ONLY TEST NOT FOUND USERS
          // 'id user PSQL': item.user.id,
          // 'user code': item.user.user_code ? item.user.user_code : 'N/A',
          // 'leader_id': item.user.leader_id ? item.user.leader_id : 'N/A',
          //************************************************************* *
          Nombre: item.user?.name ? item.user.name : 'N/A',
          Apellido: item.user?.last_name ? item.user.last_name : 'N/A',
          'No. Documento': item.user?.identification ? item.user.identification : 'N/A',
          'Fecha Nacimiento': item.user?.birth_date ? new Date(item.user.birth_date) : 'N/A',
          Genero: item.user?.gender ? item.user.gender : 'N/A',
          Telefono: item.user?.phone ? item.user.phone : 'N/A',
          "E-mail": item.user?.email ? item.user.email : 'N/A',
          Pais: item.user?.country ? item.user.country : 'N/A',
          Departamento: item.user?.departament ? item.user.departament : 'N/A',
          Municipio: item.user?.city ? item.user.city : 'N/A',
          'Tipo de Iglesia': item?.user?.type_church ? item?.user?.type_church : 'N/A',
          Sede: item.church?.name ? item.church.name : 'N/A',
          Pastor: item.pastor?.name ? `${item.pastor.name} ${item.pastor.last_name ? item.pastor.last_name : ''}` : 'N/A',
          'Lider Doce': item.leader?.name ? `${item.leader.name} ${item.leader.last_name ? item.leader.last_name : ''}` : 'N/A',
          // 'Pastor de Sede': item.pastor_church ? `${item.pastor_church.name} ${item.pastor_church.last_name ? item.pastor_church.last_name : ''}` : 'N/A',
          'Fecha de Donación': new Date(item.created_at),
          'Referencia Transaccion': item.transaction.payment_ref ? item.transaction.payment_ref : 'N/A',
          "Codigo": item.transaction.code ? item.transaction.code : 'N/A',
          'Metodo de pago': item.transaction.payment_method ? item.transaction.payment_method : 'N/A',
          'Nombre evento': item.donation?.name ? item.donation?.name : 'N/A',
          'Nombre corte': item.cut?.name ? item.cut?.name : 'N/A',
          Estado: item.transaction.status ? item.transaction.status : 'N/A',
          Costo: item.transaction.currency == 'cop' ? item.cut.prices.cop : item.cut.prices.usd,
          Moneda: item.transaction.currency ? item.transaction.currency : 'N/A',
          'Descripcion de Cambio': item.description_of_change ? item.description_of_change :'N/A'
        }
        dataToExport.push(newData)
      });
      this.exportService.exportAsExcelFile(dataToExport, !this.downloadPastor ? 'EVENTOSG12' : `${this.pastor_selected.value.name}_EVENTOSG12`);
    } else {
      this.showMessage(2, 'No hay datos por exportar');
    }
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
    } else if (payment_method.toLowerCase() == 'code') {
      return 'Codigo'
    }


  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    console.log('select year', moment(normalizedYear).year())
    datepicker.close();

    // const ctrlValue = this.date.value;
    // ctrlValue.year(normalizedYear.year());
    // this.date.setValue(moment(normalizedYear).year());
    this.date.setValue(normalizedYear);

  }
}
