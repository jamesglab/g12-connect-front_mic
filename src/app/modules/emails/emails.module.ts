import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailsRoutingModule } from './emails-routing.module';
import { EmailsComponent } from './emails.component';
import { CreateEmailComponent } from './components/create-email/create-email.component';
import { UpdateEmailComponent } from './components/update-email/update-email.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [EmailsComponent, CreateEmailComponent, UpdateEmailComponent],
  imports: [
    CommonModule,
    EmailsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
})
export class EmailsModule {}
