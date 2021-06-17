import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from 'src/app/modules/_services/export.service'
import { G12eventsService } from '../_services/g12events.service';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
 
@Component({
  selector: 'app-event-reports',
  templateUrl: './event-reports.component.html',
  styleUrls: ['./event-reports.component.scss'],
  providers:[
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},

  ]
})


export class EventReportsComponent implements OnInit {
  date = new FormControl(moment());
  campaignOne: FormGroup;
  campaignTwo: FormGroup;
  range = new FormGroup({
    init_date: new FormControl(),
    finish_date: new FormControl()
  });
  public events: [] = [];

  public event_selected = new FormControl(0, []);
  public status = new FormControl(0, []);
  public pastores: any = [];
  public pastor_selected = new FormControl(0, []);
  public payments_method = new FormControl(0, []);
  public displayedColumns: string[] = ['created_at', 'event', 'status', 'identification', 'name', 'last_name', 'email'];
  public dataSource: any;
  public downloadPastor: boolean = false;
  public search = new FormControl('', []);
  constructor(private _g12Events: G12eventsService, private cdr: ChangeDetectorRef, private exportService: ExportService) {

  }

  ngOnInit(): void {

    this.getEvents();
    this.getTransactions();
    this.getPastor();
  }

  getPastor() {
    this._g12Events.getPastor({ userCode: '01', church: '1' }).subscribe(res => {
      this.pastores = res;
    });

  }
  getEvents() {

    this._g12Events.getFilter({ type: "G12_EVENT" }).subscribe(res => {
      this.events = res;
    })
  }


  filter() {
    this.dataSource.filter = this.search.value.trim().toLowerCase();

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
      res.map((item, i) => { res[i].status = this.validateStatus(item.status); res[i].payment_method = this.validatePaymentMethod(item.payment_method) })
      if (!this.dataSource) {
        this.dataSource = new MatTableDataSource<any[]>(res);
        this.cdr.detectChanges();
      } else {
        this.dataSource.data = res;
      }

    })
  }

  exportFile() {
    const dataToExport = []
    this.dataSource.data.map(item => {

      const newData = {
        evento: item.event,
        fecha: new Date(item.created_at),
        methodo_pago: item.payment_method,
        estado: item.status,
        identificación: item.identification,
        nombre: item.name,
        apellido: item.last_name,
        email: item.email
      }
      dataToExport.push(newData)
    })

    this.exportService.exportAsExcelFile(dataToExport, !this.downloadPastor ? 'EVENTOSG12' : `${this.pastor_selected.value.name}_EVENTOSG12`)
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
    if (payment_method == 'credit') {
      return 'Tarjeta de credito'
    } else if (payment_method == 'pse') {
      return 'Transferenica bancaria'
    } else if (payment_method == 'cash') {
      return 'Efectivo'
    }
  }




  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    
  }

  // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.date.setValue(ctrlValue);
  //   datepicker.close();
  // }
}
