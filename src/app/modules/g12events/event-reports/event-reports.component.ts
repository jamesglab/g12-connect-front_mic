import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { G12eventsService } from '../_services/g12events.service';
import { ErrorStateMatcher } from '@angular/material/core';




@Component({
  selector: 'app-event-reports',
  templateUrl: './event-reports.component.html',
  styleUrls: ['./event-reports.component.scss']
})


export class EventReportsComponent implements OnInit {

  campaignOne: FormGroup;
  campaignTwo: FormGroup;
  range = new FormGroup({
    init_date: new FormControl(),
    finish_date: new FormControl()
  });
  public events: [] = [];

  public event_selected = new FormControl(0, []);
  public status = new FormControl(0, []);
  public payments_method = new FormControl(0, []);
  public displayedColumns: string[] = ['payment_method', 'amount', 'currency', 'petition', 'updated_at', 'status'];
  public dataSource: MatTableDataSource<any[]>;

  constructor(private _g12Events: G12eventsService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {

    this.getEvents();
    this.getTransactions();
  }

  getEvents() {

    this._g12Events.getFilter({ type: "G12_EVENT" }).subscribe(res => {
      this.events = res;
    })
  }
  getTransactions() {
    this._g12Events.getTransactions({ platform: "donaciones" }).subscribe(res => {
      res.map((item, i) => { res[i].status = this.validateStatus(item.status); res[i].payment_method = this.validatePaymentMethod(item.payment_method) })
      this.dataSource = new MatTableDataSource<any[]>(res);
      this.cdr.detectChanges();
    })
  }
  sendData() {


    console.log(this.event_selected.value)
    if (this.event_selected.value == 0) {
      this._g12Events.getTransactions(
        {
          filterDates: this.range.getRawValue().finish_date ? JSON.stringify({
            init_date: this.range.getRawValue().init_date.format(),
            finish_date: this.range.getRawValue().finish_date.format(),
          }) : '',
          platform: "donaciones",
          status: this.status.value.toString(),
          payment_method: this.payments_method.value
        }
      ).subscribe(res => {
        res.map((item, i) => { res[i].status = this.validateStatus(item.status); res[i].payment_method = this.validatePaymentMethod(item.payment_method) })
        this.dataSource.data = res;
      })

    } else {
      if (this.status.value != 0) {
        this._g12Events.getTransactionsEventsStatus(
          {
            event_id: this.event_selected.value.id,
            platform: "donaciones",
            status: this.status.value.toString(),
            payment_method: this.payments_method.value
          }
        ).subscribe(res => {
          res.map((item, i) => { res[i].status = this.validateStatus(item.status); res[i].payment_method = this.validatePaymentMethod(item.payment_method) })
          this.dataSource.data = res;

        })
      } else {
        this._g12Events.getTransactionsEvents(
          {
            event_id: this.event_selected.value.id,
            platform: "donaciones",
            payment_method: this.payments_method.value
          }
        ).subscribe(res => {
          res.map((item, i) => { res[i].status = this.validateStatus(item.status); res[i].payment_method = this.validatePaymentMethod(item.payment_method) })
          this.dataSource.data = res;
        })
      }
    }
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
}
