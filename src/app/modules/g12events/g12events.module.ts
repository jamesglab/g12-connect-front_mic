import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';

import { G12eventsComponent } from './g12events.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MainEventsComponent } from './main-events/main-events.component';
import { EventsTableComponent } from './components/events-table/events-table.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';

import {MatChipsModule} from '@angular/material/chips';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { EventReportsComponent } from './event-reports/event-reports.component';

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
      {
        path: 'reports',
        component: EventReportsComponent
      },
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
  declarations: [G12eventsComponent, AddEventComponent, MainEventsComponent, EventsTableComponent, 
    EditEventComponent, EventReportsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    InlineSVGModule,
    RouterModule.forChild(routes),
    MatChipsModule,
    DragDropModule
  ]
})
export class G12eventsModule { }
