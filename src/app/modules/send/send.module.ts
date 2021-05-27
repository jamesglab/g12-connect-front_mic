import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../_metronic/core';
import { GeneralModule } from '../../_metronic/partials/content/general/general.module';
import { SharedModule } from '../shared/shared.module';

import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//ANGULAR MATERIAL
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';


import { SendComponent } from './send.component';

import { GoMainComponent } from './go/main/gomain.component';
import { AddgoComponent } from './go/addgo/addgo.component';
import { GoMainTableComponent } from './go/components/go-main-table/go-main-table.component';
import { ClosegoComponent } from './go/components/closego/closego.component';
import { EditgoComponent } from './go/components/editgo/editgo.component';
import { ReportgoComponent } from './go/reportgo/reportgo.component';
import { SeereportgoComponent } from './go/seereportgo/seereportgo.component';
import { GeneralinforeportgoformComponent } from './go/components/generalinforeportgoform/generalinforeportgoform.component';
import { NewassistantreportgoformComponent } from './go/components/newassistantreportgoform/newassistantreportgoform.component';
import { AssistantslistreportgoformComponent } from './go/components/assistantslistreportgoform/assistantslistreportgoform.component';

import { GoleadersComponent } from './go/goleaders/goleaders.component';
import { GoLeadersTableComponent } from './go/components/go-leaders-table/go-leaders-table.component';
import { EdithostleaderComponent } from './go/components/edithostleader/edithostleader.component';
import { AddhostleaderComponent } from './go/components/addhostleader/addhostleader.component';

import { GoReportsMainComponent } from './reports/go-reports-main/go-reports-main.component';
import { LeadersgoreportComponent } from './reports/components/leadersgoreport/leadersgoreport.component';
import { ReportStatusGOComponent } from './reports/components/report-status-go/report-status-go.component';
import { ReportConsolidatedComponent } from './reports/components/report-consolidated/report-consolidated.component';


// import { CheckboxComponent } from './manage/checkbox/checkbox.component';


// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatDialogModule } from '@angular/material/dialog';


// Navigation
// import { MenuComponent } from './navigation/menu/menu.component';
// import { SidenavComponent } from './navigation/sidenav/sidenav.component';
// import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
// Layout
// import { CardComponent } from './layout/card/card.component';
// import { DividerComponent } from './layout/divider/divider.component';
// import { ExpansionPanelComponent } from './layout/expansion-panel/expansion-panel.component';
// import { GridListComponent } from './layout/grid-list/grid-list.component';
// import { ListComponent } from './layout/list/list.component';
// import { MaterialTabsComponent } from './layout/material-tabs/material-tabs.component';
// import { StepperComponent } from './layout/stepper/stepper.component';
// import { TreeComponent } from './layout/tree/tree.component';

// Buttons & indicators
// import { ButtonComponent } from './buttons-and-indicators/button/button.component';
// import { ButtonToggleComponent } from './buttons-and-indicators/button-toggle/button-toggle.component';
// import { ChipsComponent } from './buttons-and-indicators/chips/chips.component';
// import { IconComponent } from './buttons-and-indicators/icon/icon.component';
// import { ProgressBarComponent } from './buttons-and-indicators/progress-bar/progress-bar.component';
// import { ProgressSpinnerComponent } from './buttons-and-indicators/progress-spinner/progress-spinner.component';
// import { RipplesComponent } from './buttons-and-indicators/ripples/ripples.component';

// Popups & modals
// import {
//   DialogComponent,
//   ModalComponent,
//   Modal2Component,
//   Modal3Component,
// } from './popups-and-modals/dialog/dialog.component';
// import { SnackbarComponent } from './popups-and-modals/snackbar/snackbar.component';
// import { MaterialTooltipComponent } from './popups-and-modals/material-tooltip/material-tooltip.component';
// import { BottomSheetComponent } from './popups-and-modals/bottom-sheet/bottom-sheet.component';
// import { BottomSheetExampleComponent } from './popups-and-modals/bottom-sheet/bottom-sheet-example/bottom-sheet-example.component';
// import { PizzaPartyComponent } from './popups-and-modals/snackbar/pizza-party.component';
// Data table
// import { PaginatorComponent } from './data-table/paginator/paginator.component';
// import { SortHeaderComponent } from './data-table/sort-header/sort-header.component';
// import { MaterialTableComponent } from './data-table/material-table/material-table.component';

// import { RadiobuttonComponent } from './go/radiobutton/radiobutton.component';
// import { InputComponent } from './go/input/input.component';


// import { MatButtonModule } from '@angular/material/button';
// import { MatTabsModule } from '@angular/material/tabs';
// 

// import { MatMenuModule } from '@angular/material/menu';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatTreeModule } from '@angular/material/tree';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import {
//   MatBottomSheetModule,
//   MatBottomSheetRef,
//   MAT_BOTTOM_SHEET_DATA,
// } from '@angular/material/bottom-sheet';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatDividerModule } from '@angular/material/divider';


const routes: Routes = [
  {
    path: '',
    component: SendComponent,
    children: [
      {
        path: 'go/home',
        component: GoMainComponent,
      },
      {
        path: 'go/new',
        component: AddgoComponent
      },
      {
        path: 'go/to-report/:id',
        component: ReportgoComponent
      },
      {
        path: 'go/reports/:id',
        component: SeereportgoComponent
      },
      {
        path: 'go/leaders',
        component: GoleadersComponent
      },
      {
        path: 'report/home',
        component: GoReportsMainComponent
      },
      { path: '', redirectTo: 'go/home', pathMatch: 'full' },
      {
        path: '**',
        redirectTo: 'go/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    NgbModule,
    GeneralModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    // MATERIAL MODULES
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forChild(routes),

    // MatButtonModule,
    // MatSlideToggleModule,
    // MatSliderModule,
    // MatMenuModule,
    // MatTabsModule,
    // 
    // MatSidenavModule,
    // MatProgressBarModule,
    // MatProgressSpinnerModule,
    // MatGridListModule,
    // MatToolbarModule,
    // MatBottomSheetModule,
    // MatExpansionModule,
    // MatDividerModule,
    // MatStepperModule,
    // MatChipsModule,
    // MatRippleModule,
    // MatTreeModule,
    // MatButtonToggleModule,

  ],
  exports: [RouterModule],
  entryComponents: [
    // ClosegoComponent,
    // PizzaPartyComponent,
    // DialogComponent,
    // ModalComponent,
    // Modal2Component,
    // Modal3Component,
    // IconComponent,
    // TreeComponent,
    // BottomSheetExampleComponent,
  ],
  providers: [
    // { provide: MatBottomSheetRef, useValue: {} },
    // { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
  declarations: [
    SendComponent,
    
    GoMainComponent,
    AddgoComponent,
    GoMainTableComponent,
    ClosegoComponent,
    EditgoComponent,
    GoleadersComponent,
    GoLeadersTableComponent,
    EdithostleaderComponent,
    AddhostleaderComponent,
    ReportgoComponent,
    SeereportgoComponent,
    GeneralinforeportgoformComponent,
    NewassistantreportgoformComponent,
    AssistantslistreportgoformComponent,

    GoReportsMainComponent,
    LeadersgoreportComponent,
    ReportStatusGOComponent,
    ReportConsolidatedComponent,

    // InputComponent,
    // RadiobuttonComponent,

    // MenuComponent,
    // SidenavComponent,
    // ToolbarComponent,
    // CardComponent,
    // DividerComponent,
    // ExpansionPanelComponent,
    // GridListComponent,
    // ListComponent,
    // MaterialTabsComponent,
    // StepperComponent,
    // ButtonComponent,
    // ButtonToggleComponent,
    // ChipsComponent,
    // IconComponent,
    // ProgressBarComponent,
    // ProgressSpinnerComponent,
    // DialogComponent,
    // ModalComponent,
    // Modal2Component,
    // Modal3Component,
    // PizzaPartyComponent,
    // SnackbarComponent,
    // MaterialTooltipComponent,
    // PaginatorComponent,
    // SortHeaderComponent,
    // MaterialTableComponent,
    // TreeComponent,
    // BottomSheetComponent,
    // BottomSheetExampleComponent,
    // RipplesComponent
  ],
})
export class SendModule {}
