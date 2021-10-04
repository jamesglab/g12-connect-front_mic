import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinisterialInfoRoutingModule } from './ministerial-info-routing.module';
import { MinisterialInfoComponent } from './ministerial-info.component';


@NgModule({
  declarations: [MinisterialInfoComponent],
  imports: [
    CommonModule,
    MinisterialInfoRoutingModule
  ]
})
export class MinisterialInfoModule { }
