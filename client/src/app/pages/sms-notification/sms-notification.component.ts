import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sms-notification',
  templateUrl: './sms-notification.component.html',
  styleUrls: ['./sms-notification.component.css']
})
export class SmsNotificationComponent implements OnInit {

  public tripId: string;
  public departureId: string;

  constructor(public route: ActivatedRoute) { }

  ngOnInit() {
  }

  checkError(error){
    console.log("check error:", error);
  }

  setLoader(){
    console.log("set loader");
  }

  loadNotification(event){
    console.log("load notification event", event);
  }

}
