import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DonationsComponent } from './donations.component';
import { DonationsDashboardComponent } from './donations-dashboard/donations-dashboard.component';
import { DonationsReportsComponent } from './donations-reports/donations-reports.component';

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
  declarations: [DonationsComponent, DonationsDashboardComponent, DonationsReportsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DonationsModule { }
