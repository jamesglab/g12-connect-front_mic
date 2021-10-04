import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinisterialInfoRoutingModule } from './ministerial-info-routing.module';
import { MinisterialInfoComponent } from './ministerial-info.component';
import { MinistryComponent } from './components/ministry/ministry.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from 'src/app/_metronic/core';
import { MainNetworkComponent } from './components/main-network/main-network.component';


@NgModule({
  declarations: [MinisterialInfoComponent, MinistryComponent, MainNetworkComponent],
  imports: [
    CommonModule,
    MinisterialInfoRoutingModule,
    SharedModule,
    CoreModule
  ]
})
export class MinisterialInfoModule { }
