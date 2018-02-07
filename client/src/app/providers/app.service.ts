import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { TitleCasePipe } from '../pipes/title-case.pipe';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

declare const Array: any;

@Injectable()
export class AppService {

  constructor(private http: HttpClient, private localstorage: LocalStorageService, private router: Router) { 
    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                let foundmatch = false;
                if(a[i].indexOf(a[j]) > -1)
                  foundmatch = true;
                if(a[j].indexOf(a[i]) > -1)
                  foundmatch = true;

                if(foundmatch)
                    a.splice(j--, 1);
            }
        }
    
        return a;
    };

  }

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
      val.phone_no = val.phone_no && !isNaN(val.phone_no) ? val.phone_no : "No contact details";
      // return val.passenger_name ? true : false;
      return true;
    });

    return filteredparticipants;
  }

  public getStatuses(participants: Array<any>): Array<any>{
    let statuses = [{id: 'all', text: 'All'}]
    participants.map((val) => {
      if(val.booking_status){
        if(statuses.find(sval => sval.id === val.booking_status) === undefined){
          statuses.push({
            id: val.booking_status,
            text: new TitleCasePipe().transform(val.booking_status) 
          })
        }
      }
    });

    return statuses;
  }


}
