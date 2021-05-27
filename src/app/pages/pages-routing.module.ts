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
        canActivate:[AdminGuard],
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
        path: '',
        redirectTo: 'send',
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
export class PagesRoutingModule {}
