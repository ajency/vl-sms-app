import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

@Injectable()
export class AppService {

  constructor(private http: HttpClient, private localstorage: LocalStorageService, private router: Router) { }

  public request(url: string, method: string = 'get', body: any = {}, headers: any = {}){

    if(method === 'get'){
      return this.http.get(url, {headers: headers})
      .map((res) => {
        return res;
      })
      .catch(this.handleError.bind(this));
    }
    else{
      return this.http.post(url,body, {headers: headers})
      .map((res) => {
        return res;
      })
      .catch(this.handleError.bind(this));
    }

  }

  public handleError(error: any): Promise<any> {
    console.warn('error in request fetch',error)

    if(error.status === 401){
      this.logout();
    }

    let errMsg: string;
    if (error instanceof Response) {
      const body: any = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Promise.reject(errMsg);

  }

  public logout(){
    this.localstorage.remove("token");
    this.router.navigate(['/login']);
  }

}
