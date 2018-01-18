import { Injectable } from '@angular/core';
import { AppService } from './app.service';


@Injectable()
export class ApiService {

  public apiUrl: string = 'http://localhost:3000';

  constructor(private app: AppService) { }

  public getTrips(){
    return this.app.request(`${this.apiUrl}/v1/api/trips`,'get');
  }

  public getDepartures(id: string){
    return this.app.request(`${this.apiUrl}/v1/api/departures`,'get');
  }

  public getParticipants(id: string){
    return this.app.request(`${this.apiUrl}/v1/api/trip-participants/${id}`,'get');
  }

}
