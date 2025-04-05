import { Routes } from '@angular/router';
import { EmployeeAddComponent } from './components/employee-add/employee-add.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeViewComponent } from './components/employee-view/employee-view.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './gaurds/auth.gaurds';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'employees/add', component: EmployeeAddComponent, canActivate: [authGuard] },
  { path: 'employees/:id', component: EmployeeViewComponent, canActivate: [authGuard] },
  { path: 'employees/:id/edit', component: EmployeeEditComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];