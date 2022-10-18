import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GroupAdminComponent } from './group-admin/group-admin.component';
import { GroupAssisComponent } from './group-assis/group-assis.component';
import { LoginComponent } from './login/login.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path: '', component: AppComponent},
  {path: 'login', component: LoginComponent},
  {path: 'superAdmin/:userID', component: SuperAdminComponent},
  {path: 'groupAdmin/:userID', component: GroupAdminComponent},
  {path: 'groupAssis/:userID', component: GroupAssisComponent},
  {path: 'user/:userID', component: UserComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
