import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;
  public loginIn: boolean = false;

  public error: string;

  constructor(private auth: AuthService, private router: Router, private localstorage: LocalStorageService) { }

  ngOnInit() {
  }

  signIn(){
    this.error = '';

    this.loginIn = true;
    console.log("user", this.username, this.password)
    this.auth.login({
      username: this.username,
      password: this.password
    })
    .subscribe((res: any) => {
      this.loginIn = false;

      if(res.status === 'success'){
        this.localstorage.set("token",res.token);
        this.router.navigate(['/send-sms']);
      }
      else{
        this.error = res.msg;
      }

    },(err) => {
        this.loginIn = false;
        // this.error = err.error ? err.error.msg : err.message;
        this.error = "Server Error!";
    });
  }

}
