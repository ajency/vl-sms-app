import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../providers/api.service';

@Component({
  selector: 'send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.css']
})
export class SendSmsComponent {

  @Input() participants: Array<any>;
  @Output() onSendSms = new EventEmitter<any>();

  private smsMessage: string;
  private additionContacts: string;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  ngOnChanges(){
    console.log("sms participants",this.participants);
  }

  filterSMSContacts(){
    let smsclients = [];
    this.participants.map((val) => {
      if(val.selected == true){
        smsclients.push({
          to: val.phone_no
        });
      }
    });

    return smsclients;
  }

  addMessage(){
    let smsclients = this.filterSMSContacts();
    let smsjson = {
      message: this.smsMessage,
      sender: 'xxxxx',
      sms: smsclients
    }
    return smsjson;
  }


  sendSMS(event){
    // console.log("participants", this.participants);
    // this.api.sendSMS({api_key: '<api-key>', method: 'sms.json', json: this.addMessage()})
    this.onSendSms.emit(this.addMessage());
  }

}
