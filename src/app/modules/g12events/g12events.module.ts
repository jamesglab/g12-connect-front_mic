import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { G12eventsComponent } from './g12events.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MainEventsComponent } from './main-events/main-events.component';
import { EventsTableComponent } from './components/events-table/events-table.component';


const routes: Routes = [
  {
    path: '',
    component: G12eventsComponent,
    children: [
      {
        path: 'home',
        component: MainEventsComponent
      },
      {
        path: 'add',
        component: AddEventComponent
      },
      // {
      //   path: 'reports',
      //   component: DonationsReportsComponent
      // },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  declarations: [G12eventsComponent, AddEventComponent, MainEventsComponent, EventsTableComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class G12eventsModule { }
