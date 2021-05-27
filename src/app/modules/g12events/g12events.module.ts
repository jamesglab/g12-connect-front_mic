import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { G12eventsComponent } from './g12events.component';

const routes: Routes = [
  {
    path: '',
    component: G12eventsComponent,
    // children: [
    //   // {
    //   //   path: 'home',
    //   //   component: DonationsDashboardComponent,
    //   // },
    //   // {
    //   //   path: 'reports',
    //   //   component: DonationsReportsComponent
    //   // },
    //   // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    //   {
    //     path: '**',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full',
    //   },
    // ],
  },
];

@NgModule({
  declarations: [G12eventsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class G12eventsModule { }
