import { Injectable } from '@angular/core';
import { AppService } from './app.service';


@Injectable()
export class ApiService {

  public apiUrl: string = 'http://localhost:3000';

  constructor(private app: AppService) { }

  public getTrips(body: any){
    return this.app.request(`${this.apiUrl}/v1/api/trips`,'post',body);
  }

  public getDepartures(id: string, body: any){
    return this.app.request(`${this.apiUrl}/v1/api/departures`,'post',body);
  }

  public getParticipants(id: string){
    return this.app.request(`${this.apiUrl}/v1/api/trip-passengers`,'post',{departure_id: id});
  }

}
