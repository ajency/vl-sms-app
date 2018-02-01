import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

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
    this.router.navigate(['/admin']);
  }

  public searchFilter(callback: any = (model: string) => {return model;}): any{
    let searchterms = new Subject<string>();

    let searchsubscription = searchterms.debounceTime(500)
                                        .distinctUntilChanged()
                                        .switchMap(callback)
                                        .catch((err) => {
                                          console.warn("err:", err);
                                          return '';
                                        })

     searchsubscription
            .subscribe((res) => {
              // console.log("search response",res);
            },(err) => {
              // console.warn("search subscription err", err)
            });

    return {
      subscription: searchsubscription,
      terms: searchterms,
      triggersearch: (value) => { value.trim(); searchterms.next(value); }
    }
  }

  public filterParticipants(participants: Array<any>): Array<any>{
    let filteredparticipants = participants.filter((val)=>{
      let dups = participants.filter((bval) => bval.booking_id === val.booking_id);
      // val.redundant_contact = val.redundant_contact === '' && dups.length > 1 ? true : false;
      return val.phone_no ? true : false;
    });

    return filteredparticipants;
  }

}
