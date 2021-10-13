import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DonationsServices } from '../../../_services/donations.service';
import { ChartType } from '../../models/apex.model';
import { simplePieChart, simplePieChartCreate, validateChartValues } from '../../models/data';


@Component({
    selector: 'app-donut-donations-types',
    templateUrl: './donut-donations-types.component.html',
    styleUrls: ['./donut-donations-types.component.scss']
})
export class DonutDonationsTypesComponent implements OnInit {

    public filter = new FormControl(1, []);
    public currency = new FormControl('COP', []);
    public status = new FormControl(1, []);
    public showChart = false;
    simplePieChart: ChartType;
    constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.getTransactionsFilter();
    }

    getTransactionsFilter() {
        const filter_date = this.filter.value;
        const filter_payment = this.status.value;
        const currency = this.currency.value;
        this._donationsServices.getTotalTransactionsTypes({ filter_date, filter_payment, currency }).subscribe((res : any) => {
            this.showChart = validateChartValues(res['series']);
            this.simplePieChart = simplePieChartCreate(res['series'],res['labels'],currency) ;
            this.cdr.detectChanges();
        });
    }

}
