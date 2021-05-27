import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsComponent } from './errors.component';
// import { Error1Component } from './error1/error1.component';
// import { Error2Component } from './error2/error2.component';
import { Error3Component } from './error3/error3.component';
// import { Error4Component } from './error4/error4.component';
// import { Error5Component } from './error5/error5.component';
import { Error6Component } from './error6/error6.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorsComponent,
    children: [
      {
        path: 'error-3',
        component: Error3Component,
      },
      {
        path: 'error-6',
        component: Error6Component,
      },
      { path: '', redirectTo: 'error-1', pathMatch: 'full' },
      {
        path: '**',
        component: Error3Component,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsRoutingModule {}
