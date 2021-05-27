import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AdministrationComponent } from './administration.component';
import { MainUsersComponent } from './permissions/users/main-users/main-users.component';
import { MainRolesComponent } from './permissions/roles/main-roles/main-roles.component';
import { MainObjectsComponent } from './permissions/objects/main-objects/main-objects.component';
import { AddUserComponent } from './permissions/users/components/add-user/add-user.component';
import { UsersTableComponent } from './permissions/users/components/users-table/users-table.component';
import { AddRoleComponent } from './permissions/roles/components/add-role/add-role.component';
import { AddObjectComponent } from './permissions/objects/components/add-object/add-object.component';
import { UserTypesComponent } from './permissions/users/user-types/user-types.component';
import { TypesTableComponent } from './permissions/users/components/types-table/types-table.component';
import { AddUserTypeComponent } from './permissions/users/components/add-user-type/add-user-type.component';
import { RolesTableComponent } from './permissions/roles/components/roles-table/roles-table.component';
import { MainObjectsTypesComponent } from './permissions/objects/main-objects-types/main-objects-types.component';
import { AddObjectTypeComponent } from './permissions/objects/components/add-object-type/add-object-type.component';
import { ObjectsTableComponent } from './permissions/objects/components/objects-table/objects-table.component';
import { ObjectsTypesTableComponent } from './permissions/objects/components/objects-types-table/objects-types-table.component';
import { EditUserComponent } from './permissions/users/components/edit-user/edit-user.component';
import { EditUserTypeComponent } from './permissions/users/components/edit-user-type/edit-user-type.component';
import { DeleteItemComponent } from './permissions/delete-item/delete-item.component';
import { EditRoleComponent } from './permissions/roles/components/edit-role/edit-role.component';
import { EditObjectComponent } from './permissions/objects/components/edit-object/edit-object.component';
import { EditObjectTypeComponent } from './permissions/objects/components/edit-object-type/edit-object-type.component';
import { UserObjectsComponent } from './permissions/users/components/user-objects/user-objects.component';
import { UserRolesComponent } from './permissions/users/components/user-roles/user-roles.component';
import { RolesObjectsComponent } from './permissions/roles/components/roles-objects/roles-objects.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      {
        path: 'permisses/users',
        component: MainUsersComponent,
      },
      {
        path: 'permisses/roles',
        component: MainRolesComponent
      },
      {
        path: 'permisses/objects',
        component: MainObjectsComponent
      },
      { path: '', redirectTo: 'permisses/users', pathMatch: 'full' },
      {
        path: '**',
        redirectTo: 'permisses/users',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  declarations: [AdministrationComponent, MainUsersComponent, MainRolesComponent, MainObjectsComponent, 
    AddUserComponent, UsersTableComponent, AddRoleComponent, AddObjectComponent, UserTypesComponent, 
    TypesTableComponent, AddUserTypeComponent, RolesTableComponent, MainObjectsTypesComponent, 
    AddObjectTypeComponent, ObjectsTableComponent, ObjectsTypesTableComponent, EditUserComponent, 
    EditUserTypeComponent, DeleteItemComponent, EditRoleComponent, EditObjectComponent, EditObjectTypeComponent, UserObjectsComponent, UserRolesComponent, RolesObjectsComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    RouterModule.forChild(routes)
  ],
  providers: [MatIconRegistry]
})
export class AdministrationModule { }
