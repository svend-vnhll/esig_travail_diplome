import { Component } from '@angular/core';
import { toggleShowProfileMenu } from './javascriptfun.js';
import { toggleShowBurgerMenu } from './javascriptfun.js';
import { setConnectedEmail } from './javascriptfun.js';
import { toggleIfAdminTrue } from './javascriptfun.js';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  isAdmin: Boolean = false;
  email: String = "";

  ngOnInit() {
    this.getCookie();
    toggleIfAdminTrue(this.isAdmin);
  }

  getCookie() {
    let cookieValue = this.cookieService.get('isAdmin');
    if (cookieValue == "true") {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    };
    this.email = this.cookieService.get('email');

    if (this.email != "") {
      setConnectedEmail(this.email, this.isAdmin);
    }
  }

  killCookies() {
    this.cookieService.delete('isAdmin');
    this.cookieService.delete('email');
    window.location.href = '/';
  }

  showProfileMenu(): void {
    toggleShowProfileMenu()
  }

  showBurgerMenu(): void {
    toggleShowBurgerMenu()
  }

}
