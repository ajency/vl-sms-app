import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DefaultComponent  } from './pages/default/default.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';

import { MainDropdownsComponent } from './components/main-dropdowns/main-dropdowns.component';
import { SendSmsComponent } from './components/send-sms/send-sms.component';

import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
    { path: '', redirectTo: '/send-sms', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'send-sms', component: DefaultComponent, canActivate: [AuthGuard]},
    { path: 'send-sms/:trip_slug', component: DefaultComponent, canActivate: [AuthGuard]},
    { path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

export const routedComponents = [LoginComponent, DefaultComponent, NotfoundComponent];

export const miscComponents = [MainDropdownsComponent, SendSmsComponent]
