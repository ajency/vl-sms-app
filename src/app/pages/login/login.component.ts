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

  private username: string;
  private password: string;

  constructor(private auth: AuthService, private router: Router, private localstorage: LocalStorageService) { }

  ngOnInit() {
  }

  signIn(){
    console.log("user", this.username, this.password)
    this.auth.login({
      username: this.username,
      password: this.password
    })
    .subscribe((res: any) => {
      this.localstorage.set("token",res.token);
      this.router.navigate(['/send-sms']);
    },() => {
      
    });
  }

}
