import { Component } from '@angular/core';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  private online: boolean = true;
  constructor(){}

  ngOnInit(){
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
