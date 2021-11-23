import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxesRoutingModule } from './boxes-routing.module';
import { BoxesHomeComponent } from './home/boxes-home.component';
import { EventsComponent } from './home/events/events.component';
import { RegisteredUsersComponent } from './home/registered-users/registered-users.component';
import { SharedModule } from '../shared/shared.module';
import { DetailRegisterComponent } from './home/detail-register/detail-register.component';


@NgModule({
  declarations: [BoxesHomeComponent, EventsComponent, RegisteredUsersComponent, DetailRegisterComponent],
  imports: [
    CommonModule,
    BoxesRoutingModule,
    SharedModule
  ]
})
export class BoxesModule { }
