import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroupName } from '@angular/forms';
import { DonationsServices } from '../../../_services/donations.service';
import { ChartType } from '../../models/apex.model';
import { createBarsColumns, validateChartValues } from '../../models/data';


@Component({
  selector: 'app-bars-status-payments',
  templateUrl: './bars-status-payments.component.html',
  styleUrls: ['./bars-status-payments.component.scss']
})
export class BarsStatusPaymentsComponent implements OnInit {

  barsStatusPayment: ChartType;
  public filter = new FormControl(2);
  public payment_mehtod = new FormControl('pse');
  public showChart = false;
  constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getTransactionsFilter();
  }
  getTransactionsFilter() {
    const filter_date = this.filter.value;
    const method_payment = this.payment_mehtod.value;
    this._donationsServices.getTransactionMethodPayment({ filter_date, method_payment }).subscribe(res => {
      this.barsStatusPayment = createBarsColumns(res['series'], res['labels']);
      this.showChart = validateChartValues(res['series']);
      this.cdr.detectChanges();
    });
  }
}
