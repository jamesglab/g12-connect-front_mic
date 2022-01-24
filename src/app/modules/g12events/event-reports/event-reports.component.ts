import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
} from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ExportService } from "src/app/modules/_services/export.service";
import { G12eventsService } from "../_services/g12events.service";
import { notificationConfig } from "src/app/_helpers/tools/utils.tool";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NotificationComponent } from "src/app/pages/_layout/components/notification/notification.component";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import Swal from "sweetalert2";
import { createObjectReportByEvent, validatePaymentMethod, validateStatus } from "./moks/reports.moks";

// FORMATO DE LAS FECHAS QUE SSE VERAN EN EL ANGULAR MATERIAL
export const MY_FORMATS = {
  parse: {
    dateInput: "YYYY",
  },
  display: {
    dateInput: "YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};

@Component({
  selector: "app-event-reports",
  templateUrl: "./event-reports.component.html",
  styleUrls: ["./event-reports.component.scss"],
  providers: [
    //CREAMOS EL FORMATO DE LOS PIQUERS
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EventReportsComponent implements OnInit {
  public isLoading: boolean = false;
  // public date = new FormControl(moment());
  public maxDate: Date;
  public campaignOne: FormGroup;
  public campaignTwo: FormGroup;
  public range = new FormGroup({
    init_date: new FormControl(),
    finish_date: new FormControl(),
  });
  public events: [] = [];
  public cutTransactions: any;
  public cutSelected: any;
  public event_selected = new FormControl(0, []);
  public status = new FormControl(0, []);
  public count: any = 0;
  public pastores: any = [];
  public countsCutTable: number = 0;
  public pastor_selected = new FormControl(0, []);
  public payments_method = new FormControl(0, []);
  public displayedColumns: string[] = [
    "created_at",
    "event",
    "status",
    "identification",
    "name",
    "last_name",
    "email",
  ];
  public dataSource: any;
  public downloadPastor: boolean = false;
  public search = new FormControl("", []);
  public data_cut_table: any;
  public info_users_count: any;
  constructor(
    private _g12Events: G12eventsService,
    private cdr: ChangeDetectorRef,
    private exportService: ExportService,
    private snackBar: MatSnackBar
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getEvents();
    this.search.disable();
  }
  //CONSULTAMOS LOSO EVENTOS Y FILTRAMOS POR G12_EVENT
  getEvents() {
    this._g12Events.getAll({ type: "G12_EVENT" }).subscribe((res) => {
      this.events = res;
    });
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
    };
    if (!paginator) {
      this.info_users_count = {};
      // CONSULTAMOS LOS CONTADORES DEL EVENTO
      this.getTransactionsMongo("counts").then((counts) => {
        this.info_users_count = counts;
      });
      // CONSULTAMOS LOS CORTES DEL EVENTO
      this.getTransactionsMongo("cuts").then((cuts) => {
        this.cutTransactions = cuts;
      });
    }
    if (this.search.value) {
      filtered["filter"] = `${this.search.value}`;
    }
    // CONSULTAMOS LAS TRANSACCIONES Y PASAMOS EL TYPE EN PAGINATE
    this.search.disable();

    this.getTransactionsMongo(
      this.search.value ? "filter" : "paginate",
      filtered
    ).then((res: { count: number; reports: [any] }) => {
      this.count = res.count;
      this.search.enable();

      //VALIDAREMOS EL ESTADO Y EL METODO DE PAGO DE LA TRANSACCION
      res.reports.map((item, i) => {
        res.reports[i].transaction.status = validateStatus(
          item.transaction.status
        );
        res.reports[i].transaction.payment_method = validatePaymentMethod(
          item.transaction.payment_method
        );
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
      this._g12Events
        .getTransactionsReports({
          // date_init: `${moment(this.date.value).format(
          //   'YYYY'
          // )}-01-01T00:00:00.000`,
          // date_finish: `${moment(this.date.value).format(
          //   'YYYY'
          // )}-12-31T23:59:00.000`,
          platform: "EVENTOSG12",
          event_id:
            this.event_selected.value != 0 ? this.event_selected.value.id : "",
          type,
          ...filters,
        })
        .subscribe(
          (res: any) => {
            resolve(res);
            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
            reject(err);
            Swal.fire(
              "Error",
              "no pudimos cargar los reportes vuelve a intenterlo mas tarde",
              "error"
            );
          }
        );
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
    this._g12Events
      .getTransactionsForCut({
        cut_id: cut?._id,
        page: paginator ? paginator.pageIndex + 1 : 1,
        per_page: paginator ? paginator.pageSize : 5,
      })
      .subscribe((res: any) => {
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
      this.getTransactionsMongo("download").then((res: [any]) => {
        const dataToExport = [];
        res.map((item, i) => {
          dataToExport.push(createObjectReportByEvent(item, i));
        });
        this.exportService.exportAsExcelFile(
          dataToExport,
          this.event_selected.value.name
            .toString()
            .replace(" ", "")
            .replace(" ", "")
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      });
    } else {
      this.showMessage(2, "No hay datos por exportar");
    }
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(
      NotificationComponent,
      notificationConfig(type, message)
    );
  }

}
