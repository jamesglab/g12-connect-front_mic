import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MinisterialInfoComponent } from './ministerial-info.component';

const routes: Routes = [
  { path: '', component : MinisterialInfoComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinisterialInfoRoutingModule { }
