import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd, GuardsCheckStart, GuardsCheckEnd, ActivatedRoute } from '@angular/router'
import { Title, DOCUMENT }  from '@angular/platform-browser';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public navigationGuardCheck: boolean = false;
  public online: boolean = true;
  constructor(@Inject(DOCUMENT) private document: HTMLDocument, private titleservice: Title, private router: Router, private activateroute: ActivatedRoute){

  }

  ngOnInit(){
    this.router.events
              .filter((event) => event instanceof NavigationEnd)
              .map(() => this.activateroute)
              .map((route) => {
                while (route.firstChild) route = route.firstChild;
                return route;
              })
              .filter((route) => route.outlet === 'primary')
              .mergeMap((route) => route.data)
              .subscribe((event) => {
                console.log("router event",event);
                this.titleservice.setTitle(event["title"]);
                this.document.getElementById('appFavicon').setAttribute('href', event['icon']);
              });


    this.router.events
              .filter((event) => event instanceof GuardsCheckStart)
              .subscribe((event) => {
                console.log("guard start")
                this.navigationGuardCheck = true;
              });

    this.router.events
              .filter((event) => event instanceof GuardsCheckEnd)
              .subscribe((event) => {
                console.log("guard end")
                this.navigationGuardCheck = false;
              });

    this.checkNetwork();
  }

  checkNetwork(){
    window.addEventListener('online',  () => {
      console.log("online")
      this.online = true;
    });

    window.addEventListener('offline',  () => {
      console.log("offline")
      this.online = false;
    });
  }

}
