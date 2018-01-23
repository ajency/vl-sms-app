import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../providers/auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { globals } from '../app.global';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router, private localstorage: LocalStorageService){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        console.log("route path: ",route.routeConfig.path);

        let token = this.localstorage.get('token');

        globals.apitoken = token ? token.toString() : '';
        
        console.log("token:" , token);

        if(route.routeConfig.path == 'login'){
            if(token){
                this.router.navigate(['/send-sms']);
                return false;
            }
            else{
                
                return true;
            }
        }
        else{
            if(token){
                return true;
            }
            else{
                this.router.navigate(['/login']);
                return false;
            }
        }        
    }

}