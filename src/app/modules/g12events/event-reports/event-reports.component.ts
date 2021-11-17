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

// FORMATO DE LAS FECHAS QUE SSE VERAN EN EL ANGULAR MATERIAL
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

@Component({
  selector: 'app-event-reports',
  templateUrl: './event-reports.component.html',
  styleUrls: ['./event-reports.component.scss'],
  providers: [//CREAMOS EL FORMATO DE LOS PIQUERS
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
  public cutSelected: any;
  public event_selected = new FormControl(0, []);
  public status = new FormControl(0, []);
  public count: any = 0
  public pastores: any = [];
  public countsCutTable: number = 0;
  public pastor_selected = new FormControl(0, []);
  public payments_method = new FormControl(0, []);
  public displayedColumns: string[] = ['created_at', 'event', 'status', 'identification', 'name', 'last_name', 'email'];
  public dataSource: any;
  public downloadPastor: boolean = false;
  public search = new FormControl('', []);
  public data_cut_table: any;
  public info_users_count: any;
  constructor(private _g12Events: G12eventsService, private cdr: ChangeDetectorRef, private exportService: ExportService, private snackBar: MatSnackBar,) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {

    this.getEvents();
    this.search.disable();
    // this.getPastor();
  }

  // PARA FILTROS POR PASTOR 
  // getPastor() {
  //   this._g12Events.getLeadersOrPastors({ userCode: '01', church: '1' }).subscribe(res => {
  //     this.pastores = res;
  //   });
  // }

  //CONSULTAMOS LOSO EVENTOS Y FILTRAMOS POR G12_EVENT 
  getEvents() {
    this._g12Events.getAll({ type: "G12_EVENT" }).subscribe(res => {
      this.events = res;
    })
  }

  // FILTRAREMOS LOS DATOS QUE EL USUARIO SELECCIONE
  filter() {
    // this.dataSource.filter = this.search.value.trim().toLowerCase();
  }


  // CONSULTAREMOS LOS DATOS PARA PAGNARLOS
  getTransactionsPaginate(paginator?) {

    // VALIDAMOS SI EL METODO ESTA SIENDO PAGINADO O SI NO MANDAMOS LOS VALORES POR DEFECTO DEL PAGINADOR 
    const filtered = {
      page: paginator ? paginator.pageIndex + 1 : 1,
      per_page: paginator ? paginator.pageSize : 5,
    }
    if (!paginator) {
      this.info_users_count = {};
      // CONSULTAMOS LOS CONTADORES DEL EVENTO
      this.getTransactionsMongo('counts').then(counts => {
        this.info_users_count = counts;
      });
      // CONSULTAMOS LOS CORTES DEL EVENTO 
      this.getTransactionsMongo('cuts').then(cuts => {
        this.cutTransactions = cuts;
      });
    }
    if (this.search.value) {
      filtered['filter'] = `${this.search.value}`
    }
    // CONSULTAMOS LAS TRANSACCIONES Y PASAMOS EL TYPE EN PAGINATE
    this.search.disable();

    this.getTransactionsMongo(this.search.value ? 'filter' : 'paginate', filtered).then((res: { count: number, reports: [any] }) => {
      this.count = res.count;
      this.search.enable();

      //VALIDAREMOS EL ESTADO Y EL METODO DE PAGO DE LA TRANSACCION
      res.reports.map((item, i) => {
        res.reports[i].transaction.status = this.validateStatus(item.transaction.status);
        res.reports[i].transaction.payment_method = this.validatePaymentMethod(item.transaction.payment_method)
      });
      // CREAMOS LA TABLA DE ANGULAR MATERIAL 
      if (!this.dataSource) {
        this.dataSource = new MatTableDataSource<any[]>(res.reports);
        this.cdr.detectChanges();
      } else {
        this.dataSource.data = res.reports;
      }
    });
    //VALIDAMOS QUE SE ESTE CAMBIANDO DE EVENTO
  }

  // CONSULTAMOS LOS REPORTES POR TIPO
  getTransactionsMongo(type: any, filters?) {
    var promise = new Promise((resolve, reject) => {
      this.isLoading = true;
      this._g12Events.getTransactionsReports({
        date_init: `${moment(this.date.value).format('YYYY')}-01-01T00:00:00.000`,
        ...filters,
        date_finish: `${moment(this.date.value).format('YYYY')}-12-31T23:59:00.000`,
        platform: "EVENTOSG12",
        event_id: (this.event_selected.value != 0) ? this.event_selected.value.id : '',
        type
      }).subscribe((res: any) => {
        resolve(res)
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        reject(err);
        Swal.fire('Error', 'no pudimos cargar los reportes vuelve a intenterlo mas tarde', 'error')
      })
    });
    return promise;
  }

  // FILTRAMOS LOS CORTES CON PAGINADOR
  filterCut(cut, paginator?) {
    // VALIDAMOS UN CAMBIO DE CORTES PARA MOSTRAR EL LOADER
    if (!paginator) {
      this.data_cut_table = undefined;
    }
    this.cutSelected = cut;
    this._g12Events.getTransactionsForCut({
      cut_id: cut._id,
      page: paginator ? paginator.pageIndex + 1 : 1,
      per_page: paginator ? paginator.pageSize : 5,
    }).subscribe((res: any) => {
      this.countsCutTable = res.count;
      if (!this.data_cut_table) {
        this.data_cut_table = new MatTableDataSource<any[]>(res.reports);
        this.cdr.detectChanges();
      } else {
        this.data_cut_table.data = res.reports;
      }
    });
  }

  // EXPORTAMOS LOS DATOS
  exportFile() {
    //VALIDAREMOS LOS DATOS EXPORTADOS
    if (this.dataSource?.data.length > 0) {
      this.getTransactionsMongo('download').then((res: [any]) => {
        const dataToExport = []
        res.map(item => {
          const newData = {
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
            Estado: item.transaction.status ? this.validateStatus(item.transaction.status) : 'N/A',
            Costo: item.transaction.currency == 'cop' ? item.cut.prices.cop : item.cut.prices.usd,
            Moneda: item.transaction.currency ? item.transaction.currency : 'N/A',
            'Descripcion de Cambio': item.description_of_change ? item.description_of_change : 'N/A'
          }
          dataToExport.push(newData)
        });
        this.exportService.exportAsExcelFile(dataToExport, !this.downloadPastor ? 'EVENTOSG12' : `${this.pastor_selected.value.name}_EVENTOSG12`);
      });
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
    datepicker.close();
    this.date.setValue(normalizedYear);
  }
}
