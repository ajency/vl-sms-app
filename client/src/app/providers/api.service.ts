import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { globals } from '../app.global';

@Injectable()
export class ApiService {

  public dateFormat: string = globals.dateFormat;
  public apiUrl: string = globals.apiUrl;

  constructor(private app: AppService) { }

  private _getToken(){
    return {'Authorization': `Bearer ${globals.apitoken}`};
  }

  public getTrips(body: any){
    return this.app.request(`${this.apiUrl}/trips`,'post',body);
  }

  public getTripUpdates(body: any){
    return this.app.request(`${this.apiUrl}/trips-sms-notifications`,'post',body);
  }

  public getDepartures( body: any){
    return this.app.request(`${this.apiUrl}/departures`,'post',body);
  }

  public getParticipants(id: string){
    return this.app.request(`${this.apiUrl}/trip-passengers`,'post',{departure_id: id, access_token: globals.apitoken});
  }

  public sendSMStoClients(body: any){
    body["access_token"] = globals.apitoken;
    return this.app.request(`${this.apiUrl}/send-sms`,'post', body);
  }

  public getSMSnotifications(body: any){
    return this.app.request(`${this.apiUrl}/sms-notifications`,'post', body);
  }

}
