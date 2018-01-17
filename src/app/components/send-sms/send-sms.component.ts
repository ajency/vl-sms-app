import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.css']
})
export class SendSmsComponent {

  @Input('sms-users') smsUsers: Array<any>;
  @Output() onSendSms = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  // ngOnChanges(){
  //   console.log("sms users",this.smsUsers);
  // }

  sendSMS(event){
    this.onSendSms.emit({test: 'event'});
  }

}
