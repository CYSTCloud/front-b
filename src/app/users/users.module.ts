import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    // Import des composants standalone
    UserListComponent,
    UserDetailComponent,
    UserFormComponent
  ]
})
export class UsersModule { }
