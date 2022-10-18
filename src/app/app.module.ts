import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SuperAdminComponent } from './super-admin/super-admin.component';
import { GroupAdminComponent } from './group-admin/group-admin.component';
import { GroupAssisComponent } from './group-assis/group-assis.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import {AuthService} from  './services/auth.service'


@NgModule({
  declarations: [
    AppComponent,
    SuperAdminComponent,
    GroupAdminComponent,
    GroupAssisComponent,
    UserComponent,
    LoginComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule ,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
