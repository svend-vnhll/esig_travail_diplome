import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { showErrorMessage } from '../javascriptfun.js'
import { showInfoMessage } from '../javascriptfun.js'
import { Router } from '@angular/router';

interface CheckNewUserInputs {
  response: String;
}

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['../login-page/login-signin-page.component.css']
})
export class SigninPageComponent {
  email: string = '';
  password: String = '';

  constructor(private http: HttpClient, private router: Router) { }

  public closeError() {
    showErrorMessage("");
  }

  signin() {
    const url = 'http://127.0.0.1:8000/checks_if_user_exists/';
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

    this.http.post<CheckNewUserInputs>(url, data, options)
      .subscribe(res => {
        const response = res.response;

        if (response == "wrong_email") {
          showErrorMessage("L'e-mail entré existe déjà ou n'est pas conforme !");
        } else if (response == "invalid_password") {
          showErrorMessage("Mot de passe non conforme. Entrez un mot de passe avec au moins 8 caractères !");
        } else {
          showErrorMessage("");
          this.router.navigate(['/login']);
          setTimeout(() => {
            showInfoMessage("Inscription réussie !");
          }, 1000);
        }
      });
  }

}
