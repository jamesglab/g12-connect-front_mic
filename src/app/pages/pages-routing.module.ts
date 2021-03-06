import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';
import { AdminGuard } from '../modules/administration/_services/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        loadChildren: () =>
          import('../modules/administration/administration.module').then((m) => m.AdministrationModule)
      },
      {
        path: 'donations',
        loadChildren: () =>
          import('../modules/donations/donations.module').then((m) => m.DonationsModule)
      },
      {
        path: 'g12events',
        loadChildren: () =>
          import('../modules/g12events/g12events.module').then((m) => m.G12eventsModule)
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule)
      },
      {
        path: 'send',
        loadChildren: () =>
          import('../modules/send/send.module').then((m) => m.SendModule)
      },
      {
        path: 'to-win',
        loadChildren: () =>
          import('../modules/to-win/to-win.module').then((m) => m.ToWinModule)
      },
      {
        path: 'ministerial-info',
        loadChildren: () =>
          import('../modules/ministerial-info/ministerial-info.module').then((m) => m.MinisterialInfoModule)
      },

      {
        path: 'boxes',
        loadChildren: () =>
          import('../modules/boxes/boxes.module').then((m) => m.BoxesModule)
      },
      {
        path: 'emails',
        loadChildren: () =>
          import('../modules/emails/emails.module').then((m) => m.EmailsModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'errors/404',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
