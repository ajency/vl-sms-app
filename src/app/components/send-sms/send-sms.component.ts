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
    this.sentSMS = false;
    this.validContacts = this.filterSMSContacts().length ? true : false;
  }

  filterSMSContacts(){
    let smsclients = [];
    this.participants.map((val) => {
      if(val.selected == true){
        smsclients.push(val.phone_no);
      }
    });

    return smsclients;
  }

  addMessage(): any{
    let smsclients = this.filterSMSContacts();
    let smsjson = {
      message: this.smsMessage,
      // sender: 'xxxxx',
      sms: smsclients
    }
    return smsjson;
  }

  private validContacts: boolean = true;
  private smsError: boolean;

  validateExtraContacts(){
    this.sentSMS = false;

    let extracontacts = this.additionContacts ? this.additionContacts.split(',') : [];
    let validcontacts = false;

    let parsecontacts = extracontacts.map((val: any) => {
      let num = Number(val);
      validcontacts = ( !isNaN(num) && num.toString().length === 12 ) ? true : false;
      return validcontacts ? num.toString() : false;
    });

    this.validContacts = extracontacts.length ? validcontacts : true;

    return parsecontacts;
  }

  private sendingSMS: boolean = false;
  private sentSMS: boolean = false;

  sendSMS(event){
    this.smsError = false;

    let smsjson = this.addMessage()

    if(this.validContacts){
      smsjson['sms'] = smsjson['sms'].concat(this.validateExtraContacts());
    }

    let body = {
      // api_key: '<api-key>', 
      // method: 'sms.json', 
      json: smsjson
    };

    this.sendingSMS = true;

    this.api.sendSMStoClients(body)
            .subscribe((res: any) => {
              this.sendingSMS = false;

              if(res.status !== 'success'){
                this.sentSMS = true;
              }
              else{
                this.smsError = true;
              }
              
            }, (err) => {
              this.sendingSMS = false;
              this.smsError = true;
            });

    this.onSendSms.emit(body);
  }

}
