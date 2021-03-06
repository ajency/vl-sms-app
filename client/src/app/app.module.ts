import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';
import { LocalStorageModule } from 'angular-2-local-storage';

import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents, miscComponents } from './app-routing.module';
import { DataTableModule } from './components/custom-data-table';

// import { SelectModule } from 'ng2-select';

import { AppService, AuthService, ApiService } from './providers';

import { AuthGuard } from './guards/auth-guard.service';

import { TitleCasePipe } from './pipes/title-case.pipe';
import { CustomSelectModule } from './components/custom-select';


@NgModule({
  declarations: [
    AppComponent,
    miscComponents,
    routedComponents,
    TitleCasePipe,
  ],
  imports: [
    LocalStorageModule.withConfig({
      prefix: 'vlsms',
      storageType: 'localStorage'
    }),
    CustomSelectModule,
    MomentModule,
    // SelectModule,
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
