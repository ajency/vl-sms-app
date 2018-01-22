import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../providers/api.service';

@Component({
  selector: 'send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.css']
})
export class SendSmsComponent {

  @Input() participants: Array<any>;
  @Input() checkupdate: boolean;
  @Output() onSendSms = new EventEmitter<any>();

  private smsMessage: string;
  private additionContacts: string;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  ngOnChanges(){
    console.log("sms participants",this.participants);
    this.validContacts = this.filterSMSContacts().length ? true : false;
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

  addMessage(): any{
    let smsclients = this.filterSMSContacts();
    let smsjson = {
      message: this.smsMessage,
      sender: 'xxxxx',
      sms: smsclients
    }
    return smsjson;
  }

  private validContacts: boolean = true;

  validateExtraContacts(){
    
    let extracontacts = this.additionContacts ? this.additionContacts.split(',') : [];
    let validcontacts = false;

    let parsecontacts = extracontacts.map((val: any) => {
      let num = Number(val);
      validcontacts = ( !isNaN(num) && num.toString().length === 12 ) ? true : false;
      return validcontacts ? { to: num.toString() } : false;
    });

    this.validContacts = extracontacts.length ? validcontacts : true;

    return parsecontacts;
  }

  sendSMS(event){
    let smsjson = this.addMessage()

    if(this.validContacts){
      smsjson['sms'] = smsjson['sms'].concat(this.validateExtraContacts());
    }

    let body = {
      api_key: '<api-key>', 
      method: 'sms.json', 
      json: smsjson
    };
    // console.log("participants", this.participants);
    // this.api.sendSMS({api_key: '<api-key>', method: 'sms.json', json: this.addMessage()})
    this.onSendSms.emit(body);
  }

}
