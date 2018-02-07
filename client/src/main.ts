import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// console.log("app is starting from prod.....")
function disableLogs(){
  console.log = function() {};
  console.warn = function() {};
}

if (environment.production) {
  enableProdMode();
  disableLogs();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
