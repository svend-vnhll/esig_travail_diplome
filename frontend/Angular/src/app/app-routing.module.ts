import { NgModule } from '@angular/core';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SigninPageComponent } from './signin-page/signin-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { HorairePageComponent } from './horaire-page/horaire-page.component';
import { BulletinPageComponent } from './bulletin-page/bulletin-page.component';
import { AbsencePageComponent } from './absence-page/absence-page.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'signin', component: SigninPageComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'horaire', component: HorairePageComponent },
  { path: 'bulletin', component: BulletinPageComponent },
  { path: 'absence', component: AbsencePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
