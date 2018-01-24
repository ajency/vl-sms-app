import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { globals } from '../../app.global';

@Component({
  selector: 'app-sms-notification',
  templateUrl: './sms-notification.component.html',
  styleUrls: ['./sms-notification.component.css']
})
export class SmsNotificationComponent implements OnInit {

  public tripId: string;
  public departureId: string;
  public tripDetails: any;
  public depDetails: any;
  public notifications: Array<any> = [];
  public dateFormat: string = '';
  public naText: string = '--';
  public errorMessage: string = '';
  public loadinNotifications: boolean = false;

  constructor(public route: ActivatedRoute) {
    this.dateFormat = globals.dateFormat;
  }

  ngOnInit() {
  }

  checkError(error){
    console.log("check error:", error);
  }

  setLoader(){
    this.loadinNotifications = true;
    this.notifications = [];
    console.log("set loader");
  }

  loadNotification(event){
    console.log("load notification event", event);

    if(event.response.data && event.response.data.length){
      this.errorMessage = '';        
      this.tripDetails = event['trip_details'];
      this.depDetails = event['dep_details'];

      this.notifications = event.response.data;
    }
    else{
      this.errorMessage = event.response.msg || 'An error occured!';
    }

    this.loadinNotifications = false;
  }

}
