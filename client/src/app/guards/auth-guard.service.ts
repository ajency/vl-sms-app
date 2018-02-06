import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../providers/auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { globals } from '../app.global';

import 'rxjs/add/operator/finally'

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router, private localstorage: LocalStorageService){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>{
        console.log("route path: ",route.routeConfig.path);

        let queryparams = route.queryParams;
        let querytoken = queryparams['token'];

        if(querytoken){ // if token is present in the query
            let validateresponse;

            return new Promise((res,rej) => {

                this.auth.validateToken({token: querytoken})
                        .finally(() => {
                            if(validateresponse.status === 'success'){
                                globals.apitoken = querytoken ? querytoken.toString() : '';
                                console.log("query token:" , querytoken);
                                res(true);
                            }
                            else{
                                this.router.navigate(['/admin']);
                                res(false);
                            }
                        })
                        .subscribe((res: any) => {
                            validateresponse = res;
                        }, (error) => {
                            validateresponse = error;
                        });

  
            });
        }
        else{ // check for token from local storage
            let token = this.localstorage.get('token');

            globals.apitoken = token ? token.toString() : '';
            console.log("local token:" , token);

            return new Promise((res,rej) => {
                if(route.routeConfig.path == 'admin'){
                    if(token){
                        this.router.navigate(['/send-sms']);
                        // return false;
                        res(false);
                    }
                    else{
                        
                        // return true;
                        res(true);
                    }
                }
                else{
                    if(token){
                        // return true;
                        res(true);
                    }
                    else{
                        this.router.navigate(['/admin']);
                        // return false;
                        res(false);
                    }
                }   
            });

        } //
             
    }

}