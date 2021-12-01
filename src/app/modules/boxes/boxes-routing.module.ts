import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoxesHomeComponent } from './home/boxes-home.component';

const routes: Routes = [
  {
    path: 'home',
    component: BoxesHomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoxesRoutingModule { }
