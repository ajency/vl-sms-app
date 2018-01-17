import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';
import { DataTableModule } from './custom-data-table';
import { AuthService } from './providers/auth.service';
import { AuthGuard } from './guards/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    routedComponents
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    DataTableModule,
    BrowserModule
  ],
  entryComponents: [
    // routedComponents
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
