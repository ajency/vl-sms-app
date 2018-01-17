import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    routedComponents
  ],
  imports: [
    AppRoutingModule,
    BrowserModule
  ],
  entryComponents: [
    // routedComponents
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
