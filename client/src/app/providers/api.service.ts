import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { globals } from '../app.global';

@Injectable()
export class ApiService {

  public dateFormat: string = globals.dateFormat;
  public apiUrl: string = globals.apiUrl;

  constructor(private app: AppService) { }

  public getTrips(body: any){
    return this.app.request(`${this.apiUrl}/v1/api/trips`,'post',body);
  }

  public getDepartures( body: any){
    return this.app.request(`${this.apiUrl}/v1/api/departures`,'post',body);
  }

  public getParticipants(id: string){
    return this.app.request(`${this.apiUrl}/v1/api/trip-passengers`,'post',{departure_id: id});
  }

  public sendSMStoClients(body: any){
    return this.app.request(`${this.apiUrl}/v1/api//send-sms`,'post', body);
  }

}
