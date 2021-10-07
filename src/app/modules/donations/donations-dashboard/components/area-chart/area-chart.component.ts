import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartComponent } from 'ng-apexcharts';
import { DonationsServices } from '../../../_services/donations.service';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements OnInit {
  chartOptions: any;
  @ViewChild('chart') chart: ChartComponent;
  public dateRange = new FormControl();

  constructor(private _donationsServices: DonationsServices,private cdr :ChangeDetectorRef) { }

  ngOnInit(): void {
    this.chartOptions = {
      series:
        [
          {
            name: 'Epayco',
            data: [
              3, 1, 0, 0, 0, 2, 1, 2,
              3, 2, 2, 6, 2, 4, 0, 5,
              22, 16, 4, 24, 6, 3, 2, 1,
              0
            ]
          },
          { name: 'PayPal', data: [0, 0, 0, 0, 0] },
          {
            name: 'Payu',
            data: [
              0, 0, 0, 2, 2,
              1, 1, 0, 1, 0
            ]
          },
          { name: 'Stripe', data: [0, 0, 0, 0, 1, 0] }
        ]
      ,
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:00:00.000Z',
          '2018-09-19T02:00:00.000Z',
          '2018-09-19T03:00:00.000Z',
          '2018-09-19T04:00:00.000Z',
          '2018-09-19T05:00:00.000Z',
          '2018-09-19T06:00:00.000Z',
          '2018-09-19T07:00:00.000Z',
          '2018-09-19T08:00:00.000Z',
          '2018-09-19T09:00:00.000Z',
          '2018-09-19T10:00:00.000Z',
          '2018-09-19T11:00:00.000Z',
          '2018-09-19T12:00:00.000Z',
          '2018-09-19T13:00:00.000Z',
          '2018-09-19T14:00:00.000Z',
          '2018-09-19T15:00:00.000Z',
          '2018-09-19T16:00:00.000Z',
          '2018-09-19T17:00:00.000Z',
          '2018-09-19T18:00:00.000Z',
          '2018-09-19T19:00:00.000Z',
          '2018-09-19T20:00:00.000Z',
          '2018-09-19T21:00:00.000Z',
          '2018-09-19T22:00:00.000Z',
          '2018-09-19T23:00:00.000Z',
          '2018-09-19T23:59:00.000Z',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }

  getFilterDateChart() {
    console.log(this.dateRange.value)
    console.log('tenemos la data',)
    this._donationsServices.getDonationBy24Hour({
      filter_date_init: new Date(this.dateRange.value.set('hours', 0).set('minutes', 0).set('seconds', 0).toISOString()).getTime(),
      filter_date_finish: new Date(this.dateRange.value.set('hours', 23).set('minutes', 59).set('seconds', 59).toISOString()).getTime()
    }).subscribe(res => {
      // console.log(res)
      this.chartOptions.series = res;
      this.cdr.detectChanges();
    })
  }

  // this.chartOptions = {
  //   series: [
  //     {
  //       name: "South",
  //       data: this.generateDayWiseTimeSeries(
  //         new Date("11 Feb 2017 GMT").getTime(),
  //         20,
  //         {
  //           min: 10,
  //           max: 60
  //         }
  //       )
  //     }
  //   ],
  //   chart: {
  //     type: "area",
  //     height: 350,
  //     stacked: true,
  //     events: {
  //       selection: function(chart, e) {
  //         console.log(new Date(e.xaxis.min));
  //       }
  //     }
  //   },
  //   colors: ["#008FFB", "#00E396", "#CED4DC"],
  //   dataLabels: {
  //     enabled: false
  //   },
  //   fill: {
  //     type: "gradient",
  //     gradient: {
  //       opacityFrom: 0.6,
  //       opacityTo: 0.8
  //     }
  //   },
  //   legend: {
  //     position: "top",
  //     horizontalAlign: "left"
  //   },
  //   xaxis: {
  //     type: "datetime"
  //   }
  // };
}
//   public generateDayWiseTimeSeries = function(baseval, count, yrange) {
//     var i = 0;
//     var series = [];
//     while (i < count) {
//       var x = baseval;
//       var y =
//         Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
//       series.push([x, y]);
//       baseval += 86400000;
//       i++;
//     }
//     console.log('tenemos series',series)
//     return series;
//   };
// }
