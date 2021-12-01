import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxesRoutingModule } from './boxes-routing.module';
import { BoxesHomeComponent } from './home/boxes-home.component';
import { EventsComponent } from './home/events/events.component';
import { RegisteredUsersComponent } from './home/registered-users/registered-users.component';
import { SharedModule } from '../shared/shared.module';
import { DetailRegisterComponent } from './home/detail-register/detail-register.component';
import { RegisterUserBoxComponent } from './home/register-user-box/register-user-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';


@NgModule({
  declarations: [BoxesHomeComponent, EventsComponent, RegisteredUsersComponent, DetailRegisterComponent, RegisterUserBoxComponent],
  imports: [
    CommonModule,
    BoxesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    InlineSVGModule,
  ]
})
export class BoxesModule { }
