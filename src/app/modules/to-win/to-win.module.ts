import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../_metronic/core';
import { GeneralModule } from '../../_metronic/partials/content/general/general.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';

//ANGULAR MATERIAL
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ToWinComponent } from './to-win.component';

import { MainPhoneVisitComponent } from './phone-visit/main-phone-visit/main-phone-visit.component';
import { PhoneVisitTableComponent } from './phone-visit/components/phone-visit-table/phone-visit-table.component';
import { ReportVisitComponent } from './phone-visit/components/report-visit/report-visit.component';
import { BoardPhoneVisitComponent } from './phone-visit/components/board-phone-visit/board-phone-visit.component';
import { ManagePhoneVisitComponent } from './phone-visit/components/manage-phone-visit/manage-phone-visit.component';

import { AddPeopleComponent } from './people/main-people/add-people.component';
import { SearchPeopleComponent } from './people/search-people/search-people.component';
import { ToWinReportsMainComponent } from './reports/to-win-reports-main/to-win-reports-main.component';
import { SearchPeopleFilterComponent } from './people/components/search-people-filter/search-people-filter.component';
import { ManagePersonComponent } from './people/components/manage-person/manage-person.component';
import { WinReportTableComponent } from './reports/components/win-report-table/win-report-table.component';
import { SeeDetailWinnedComponent } from './reports/components/see-detail-winned/see-detail-winned.component';
import { DashboardReportsComponent } from './reports/components/dashboard-reports/dashboard-reports.component';
import { ReportsFilterComponent } from './reports/components/reports-filter/reports-filter.component';

const routes: Routes = [
  {
    path: '',
    component: ToWinComponent,
    children: [
      {
        path: 'phone-visit',
        component: MainPhoneVisitComponent ,
      },
      {
        path: 'people/new',
        component: AddPeopleComponent
      },
      {
        path: 'people/search',
        component: SearchPeopleComponent,
      },
      {
        path: 'reports',
        component: ToWinReportsMainComponent
      },
      { path: '', redirectTo: 'phone-visit', pathMatch: 'full' },
      {
        path: '**',
        redirectTo: 'phone-visit',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  declarations: [
    ToWinComponent,

    MainPhoneVisitComponent,
    PhoneVisitTableComponent, 
    ReportVisitComponent, 
    BoardPhoneVisitComponent, 
    ManagePhoneVisitComponent,

    AddPeopleComponent, 
    SearchPeopleComponent, 
    ToWinReportsMainComponent, SearchPeopleFilterComponent, ManagePersonComponent, WinReportTableComponent, SeeDetailWinnedComponent, DashboardReportsComponent, ReportsFilterComponent, 
  ],
  imports: [
    CommonModule,
    CoreModule,
    GeneralModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    //MATERIAL MODULES
    MatIconModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatNativeDateModule,
    RouterModule.forChild(routes)
  ],
  providers:[MatIconRegistry,
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class ToWinModule { }
