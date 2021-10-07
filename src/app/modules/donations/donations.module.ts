import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DonationsComponent } from './donations.component';
import { DonationsDashboardComponent } from './donations-dashboard/donations-dashboard.component';
import { DonationsReportsComponent } from './donations-reports/donations-reports.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ReportsTableComponent } from './donations-reports/components/reports-table/reports-table.component';
import { WidgetsModule } from 'src/app/_metronic/partials/content/widgets/widgets.module';
import { DonutTransactionsComponent } from './donations-dashboard/components/donut-transactions/donut-transactions.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TimeLineComponent } from './donations-dashboard/components/time-line/time-line.component';
import { DonutDonationsTypesComponent } from './donations-dashboard/components/donut-donations-types/donut-donations-types.component';
import { CompareYearsComponent } from './donations-dashboard/components/compare-years/compare-years.component';
import { AreaChartComponent } from './donations-dashboard/components/area-chart/area-chart.component';
import { TotalTransactionsComponent } from './donations-dashboard/components/total-transactions/total-transactions.component';
import { BarsStatusPaymentsComponent } from './donations-dashboard/components/bars-status-payments/bars-status-payments.component';
import { NotFoundChartComponent } from './donations-dashboard/components/not-found-chart/not-found-chart.component';
import { ModaleTransactionComponent } from './donations-reports/components/modale-transaction/modale-transaction.component';

// import { ApexComponent } from './donations-dashboard/components/apex/apex.component';
// import { NgxChartistModule } from 'ngx-chartist';
// import { NgxEchartsModule } from 'ngx-echarts';
// import { ChartsModule } from 'ng2-charts';
// import { NgxChartistModule } from 'ngx-chartist';
// import { NgxEchartsModule } from 'ngx-echarts';

const routes: Routes = [
  {
    path: '',
    component: DonationsComponent,
    children: [
      {
        path: 'dashboard',
        component: DonationsDashboardComponent,
      },
      {
        path: 'reports',
        component: DonationsReportsComponent,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  declarations: [
    DonationsComponent,
    DonationsDashboardComponent,
    DonationsReportsComponent,
    ReportsTableComponent,
    DonutTransactionsComponent,
    TimeLineComponent,
    DonutDonationsTypesComponent,
    CompareYearsComponent,
    AreaChartComponent,
    TotalTransactionsComponent,
    BarsStatusPaymentsComponent,
    NotFoundChartComponent,
    ModaleTransactionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    WidgetsModule,
    NgApexchartsModule,

    // NgApexchartsModule,
    // ChartsModule,
    // NgxEchartsModule.forRoot({
    //   echarts: () => import('echarts')
    // })
  ],
})
export class DonationsModule {}
