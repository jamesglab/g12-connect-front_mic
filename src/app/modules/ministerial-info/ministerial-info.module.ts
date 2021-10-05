import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinisterialInfoRoutingModule } from './ministerial-info-routing.module';
import { MinisterialInfoComponent } from './ministerial-info.component';
import { MinistryComponent } from './components/ministry/ministry.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from 'src/app/_metronic/core';
import { MainNetworkComponent } from './components/main-network/main-network.component';
import { EditUserMinistryComponent } from './components/edit-user-ministry/edit-user-ministry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';


@NgModule({
  declarations: [MinisterialInfoComponent, MinistryComponent, MainNetworkComponent, EditUserMinistryComponent],
  imports: [
    CommonModule,
    MinisterialInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    NgbModule,
    InlineSVGModule,

  ]
})
export class MinisterialInfoModule { }
