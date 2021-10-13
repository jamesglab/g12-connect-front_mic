import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartType } from 'src/app/_metronic/partials/content/widgets/datasets/apex.model';
import { DonationsServices } from '../../../_services/donations.service';
import { barsColumns, createBarsColumns, validateChartValues } from '../../models/data';

@Component({
  selector: 'app-compare-years',
  templateUrl: './compare-years.component.html',
  styleUrls: ['./compare-years.component.scss']
})
export class CompareYearsComponent implements OnInit {

  page: number = 1;
  public filter = new FormControl(2, []);
  public currency = new FormControl('COP', []);
  public barsColumns: ChartType;
  public showChart = false;
  public totalsValues: any;

  constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) {


  }

  ngOnInit(): void {
    this.getFilterType(1);
    this.getTransactionsFilter();
  }

  getFilterType(type?) {
    const currency = this.currency.value;

    this._donationsServices.getTotalValuesOrQuantity({ filter: type, currency }).subscribe(res => {
      this.totalsValues = res;
      this.page = type;
      this.cdr.detectChanges();
      
    });

  }
  getTransactionsFilter() {
    const filter_date = this.filter.value;
    const currency = this.currency.value;
    if (this.page == 1) {
      this._donationsServices.getTotalTransactionsGraph({ filter_date, currency }).subscribe(res => {
        this.showChart = validateChartValues(res['series']);
        this.barsColumns = createBarsColumns(res['series'], res['labels'],currency);
        this.getFilterType(this.page);
      });
    } else {
      this._donationsServices.getTotalQuantityGraph({ filter_date, currency }).subscribe(res => {
        this.showChart = validateChartValues(res['series']);
        this.getFilterType(this.page);
        this.barsColumns = createBarsColumns(res['series'], res['labels'],currency)
      });
    }
  }
}


