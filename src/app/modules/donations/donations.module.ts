import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DonationsComponent } from './donations.component';
import { DonationsDashboardComponent } from './donations-dashboard/donations-dashboard.component';
import { DonationsReportsComponent } from './donations-reports/donations-reports.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ReportsTableComponent } from './donations-reports/components/reports-table/reports-table.component';



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
        component: DonationsReportsComponent
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
  declarations: [DonationsComponent, DonationsDashboardComponent, DonationsReportsComponent, ReportsTableComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class DonationsModule { }
