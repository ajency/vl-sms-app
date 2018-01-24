import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router'
import { Title }  from '@angular/platform-browser';

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

  public online: boolean = true;
  constructor(private titleservice: Title, private router: Router, private activateroute: ActivatedRoute){

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
