import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ApiService } from '../../providers/api.service';

@Component({
  selector: 'send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.css']
})
export class SendSmsComponent {

  @Input() participants: Array<any>;
  @Input() checkupdate: boolean;
  @Input() departureid: string;
  @Input() tripid: string;

  @Output() onSendSms = new EventEmitter<any>();

  public smsMessage: string = '';
  public additionContacts: string;

  public sendingSMS: boolean = false;
  public sentSMS: boolean = false;
  public publishNotification: boolean = false;

  public validContacts: boolean = true;
  public smsError: boolean;

  @ViewChild('smsTextCount') smsTextCount;

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
      if(val.selected === true && val.filteredout === false && !isNaN(val.phone_no)){
        smsclients.push(val.phone_no);
      }
    });

    return smsclients;
  }

  addMessage(): any{
    let smsclients = this.filterSMSContacts();
    let smsjson = {
      departure_id: this.departureid,
      trip_id: this.tripid,
      message: this.smsMessage,
      publishnotification: this.publishNotification, 
      to: smsclients
    }
    return smsjson;
  }

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

  public smsMaxLength: number = 1000;

  checkSMSlength(event){
    this.sentSMS = false
    // console.log(this.smsTextCount.nativeElement.firstChild);
    // this.smsTextCount.nativeElement.firstChild.innerText = this.smsMessage.length;

    if(this.smsMessage.length >= this.smsMaxLength){
      this.smsMessage = this.smsMessage.substr(0, this.smsMaxLength);
    }

    console.log("sms length", this.smsMessage.length);
  }

  sendSMS(){

    if(this.smsError){
      this.smsError = false;
      return;
    }

    let body = this.addMessage()

    if(this.validContacts){
      body['to'] = body['to'].concat(this.validateExtraContacts());
    }

    this.sendingSMS = true;

    this.api.sendSMStoClients(body)
            .subscribe((res: any) => {
              this.sendingSMS = false;

              if(res.status === 'success'){
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
