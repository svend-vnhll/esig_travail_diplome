import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { showErrorMessage } from '../javascriptfun.js';
import { showInfoMessage } from '../javascriptfun.js';
import { CookieService } from 'ngx-cookie-service';

interface TryLoginResponse {
  response: String;
  isAdmin: Boolean;
  email: String;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-signin-page.component.css']
})
export class LoginPageComponent {
  email: string = '';
  password: String = '';

  constructor(private http: HttpClient, private cookieService: CookieService, private elementRef: ElementRef, private renderer: Renderer2) { }

  public closeError() {
    showErrorMessage("");
  }

  login() {
    const url = 'http://127.0.0.1:8000/try_login/';
    const data = {
      email: this.email,
      password: this.password
    };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    this.http.post<TryLoginResponse>(url, data, options)
      .subscribe(res => {
        const response: String = res.response;
        if (response == "all_ok") {
          const isAdmin: Boolean = res.isAdmin;
          const email: String = res.email;

          showInfoMessage("Connexion réussie !");
          setTimeout(() => {
            window.location.href = '/';
            this.setCookie(String(isAdmin), String(email));
          }, 1500);
        } else if (response == "wrong_password") {
          let input_pswd = this.elementRef.nativeElement.querySelector('#input_password');
          this.renderer.setProperty(input_pswd, 'value', '');
          showErrorMessage("Mot de passe incorrect !");
        } else if (response == "invalid_email") {
          showErrorMessage("Email invalide ou non existant !");
          let input_pswd = this.elementRef.nativeElement.querySelector('#input_password');
          this.renderer.setProperty(input_pswd, 'value', '');
        }
      });
  }

  setCookie(isAdmin: string, email: string) {
    const expirationInSeconds = 3600;
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + expirationInSeconds * 1000);

    this.cookieService.set('isAdmin', isAdmin, expirationDate);
    this.cookieService.set('email', email, expirationDate);
  }

}
