import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DonationsServices } from '../../../_services/donations.service';
import { ChartType } from '../../models/apex.model';
import { timeLineChart, validateChartValues } from '../../models/data';

@Component({
    selector: 'app-time-line',
    templateUrl: './time-line.component.html',
    styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {

    linewithDataChart: ChartType;
    showChart: boolean;
    public type_filter = new FormControl(2, []);
    public filter = new FormControl('COP', []);
    public selectedDonation = new FormControl(null, []);
    public payment_method = new FormControl(null, []);
    public selectDonation = new FormControl(null, []);

    public donations: [] = [];

    constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        // this.getData();
        this.getDonations();
    }

    getDonations() {
        this._donationsServices.getDonationsMCI().subscribe((res: any) => {
            this.donations = res;
            this.cdr.detectChanges();
        })
    }
    getData() {
        console.log('donation',this.selectedDonation.value)
        this._donationsServices.getTimeLineTotals({
            type_filter: this.type_filter.value, filter: (this.type_filter.value == 1) ?
                this.selectedDonation.value.id : this.payment_method.value
        }).subscribe(res => {
            this.linewithDataChart = timeLineChart(res['series'], res['categories']);
            // this.showChart = true;
            this.showChart = validateChartValues(res['series'][0].data.concat(res['series'][1].data));
            this.cdr.detectChanges();
        })
    }

}
