import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents, miscComponents } from './app-routing.module';
import { DataTableModule } from './custom-data-table';

import { AppService, AuthService, ApiService } from './providers';

import { AuthGuard } from './guards/auth-guard.service';

import { TitleCasePipe } from './pipes/title-case.pipe';


@NgModule({
  declarations: [
    AppComponent,
    miscComponents,
    routedComponents,
    TitleCasePipe
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    DataTableModule,
    BrowserModule
  ],
  entryComponents: [
    // routedComponents
  ],
  providers: [AppService, AuthService, ApiService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
