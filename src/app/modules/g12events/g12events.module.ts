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

import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EventReportsComponent } from './event-reports/event-reports.component';
import { TableReportsComponent } from './event-reports/components/table-reports/table-reports.component';
import { ShowUsersCountsComponent } from './event-reports/components/show-users-counts/show-users-counts.component';
import { ShowCutCountsComponent } from './event-reports/components/show-cut-counts/show-cut-counts.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsersNotPastorComponent } from './users-not-pastor/users-not-pastor.component';
import { EditReportNotPastorComponent } from './users-not-pastor/components/edit-report-not-pastor/edit-report-not-pastor.component';
import { AddAssistantComponent } from './users-not-pastor/components/add-assistant/add-assistant.component';
import { GenerateCodesComponent } from './components/generate-codes/generate-codes.component';
import { changeEventUserComponent } from './users-not-pastor/components/change-event-user/change-event-user.component';
import { CuponsReportsComponent } from './cupons-reports/cupons-reports.component'
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
        path: 'users',
        component: UsersNotPastorComponent
      },
      {
        path: 'add',
        component: AddEventComponent
      },
      {
        path: 'reports',
        component: EventReportsComponent
      },
      {
        path: 'cupons',
        component: CuponsReportsComponent
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
    EditEventComponent, EventReportsComponent, TableReportsComponent, AddAssistantComponent, ShowUsersCountsComponent, ShowCutCountsComponent, UsersNotPastorComponent, EditReportNotPastorComponent, GenerateCodesComponent, changeEventUserComponent, CuponsReportsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    InlineSVGModule,
    RouterModule.forChild(routes),
    MatChipsModule,
    DragDropModule,

  ]
})
export class G12eventsModule { }
