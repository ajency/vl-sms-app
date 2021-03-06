import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { globals } from '../app.global';

@Injectable()
export class AuthService {

  constructor(private app: AppService) { }

  public login(body: any){
    return this.app.request(`${globals.apiUrl}/login`,'post',body);
  }

  public validateToken(body: any){
    return this.app.request(`${globals.apiUrl}/validate-token`,'post',body);
  }

}
