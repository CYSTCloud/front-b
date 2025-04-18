import { Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'users/new', loadComponent: () => import('./users/user-form/user-form.component').then(c => c.UserFormComponent) },
  { path: 'users/edit/:id', loadComponent: () => import('./users/user-form/user-form.component').then(c => c.UserFormComponent) },
  { path: 'users/:id', loadComponent: () => import('./users/user-detail/user-detail.component').then(c => c.UserDetailComponent) },
  { path: '**', redirectTo: 'users' }
];
