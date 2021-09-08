import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

    constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        this._donationsServices.getTimeLineTotals({ type_filter: 2, filter: 'pse' }).subscribe(res => {
            this.linewithDataChart = timeLineChart(res['series'], res['categories']);
            this.showChart = validateChartValues(res['series'][0].data);
            this.showChart = validateChartValues(res['series'][1].data);
            this.cdr.detectChanges();
        })
    }

}
