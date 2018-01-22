import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }

  public request(url: string, method: string = 'get', body: any = {}){

    if(method === 'get'){
      return this.http.get(url)
      .map((res) => {
        return res;
      }, (err) => {
        this.handleError(err);
      });
    }
    else{
      return this.http.post(url,body)
      .map((res) => {
        return res;
      }, (err) => {
        this.handleError(err);
      });
    }

  }

  public handleError(error: any): Promise<any> {
    console.warn('error in request fetch',error)

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

}
