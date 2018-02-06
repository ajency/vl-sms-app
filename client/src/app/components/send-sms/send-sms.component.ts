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

  @Output() onSendSms = new EventEmitter<any>();

  public smsMessage: string = '';
  public additionContacts: string = '';

  public sendingSMS: boolean = false;
  public sentSMS: boolean = false;
  public publishNotification: boolean = false;

  public validContacts: boolean = false;
  public validExtraContacts: boolean = false;
  public smsError: boolean;

  @ViewChild('smsTextCount') smsTextCount;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  ngOnChanges(){
    console.log("sms participants",this.participants);
    this.sentSMS = false;
    this.validContacts = this.filterSMSContacts().length ? true : false;
    this.filterExtraContacts();
    
  }

  validateSMSContacts(): boolean{ //
    // console.log("validateion")
    if(this.validContacts && this.validExtraContacts){ // if both are valid
      // console.log("this.validContacts && this.validExtraContacts")
      return false;
    }
    else if(this.validContacts && !this.validExtraContacts){
      // console.log("this.validContacts && !this.validExtraContacts")
      if(this.additionContacts.length){
        return true; // if invalid contacts in extras field
      }
      else{
        return false;
      }
    }
    else if(!this.validContacts && this.validExtraContacts){
      // console.log("!this.validContacts && this.validExtraContacts")
      return false;
    }
    else{
      // console.log("default");
      return true;
    }
  }

  checkForValidExtras(flag){
    this.validExtraContacts = flag;
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
      message: this.smsMessage,
      publishnotification: this.publishNotification, 
      to: smsclients
    }
    return smsjson;
  }

  filterExtraContacts(){
    this.sentSMS = false;

    let extracontacts = this.additionContacts ? this.additionContacts.split(',') : [];

    let parsecontacts = [];
    let validcontact = true;

    extracontacts.map((val: any) => {
      // let num = parseInt(val);
      val = val.trim();
      let valid = ( !isNaN(val) && val.length === 12 && val.indexOf('.') < 0 ) ? true : false;
      valid ? parsecontacts.push( val ) : null;
      if(validcontact){
        validcontact = valid;
      }
    });
    
    this.checkForValidExtras(extracontacts.length ? validcontact : false);

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

    if(this.validExtraContacts){
      body['to'] = body['to'].concat(this.filterExtraContacts()).unique();
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
