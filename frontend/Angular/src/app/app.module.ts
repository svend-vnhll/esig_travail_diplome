import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SigninPageComponent } from './signin-page/signin-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { HttpClientModule } from '@angular/common/http';
import { HorairePageComponent } from './horaire-page/horaire-page.component';
import { BulletinPageComponent } from './bulletin-page/bulletin-page.component';
import { AbsencePageComponent } from './absence-page/absence-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SigninPageComponent,
    MainPageComponent,
    AdminPageComponent,
    HorairePageComponent,
    BulletinPageComponent,
    AbsencePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
