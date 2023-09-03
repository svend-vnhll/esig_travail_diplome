import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Publication } from '../interfaces/publication.js'
import { toggleIfAdminTrue } from '../javascriptfun.js';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['../app.component.css']
})
export class MainPageComponent {
  publications: Publication[] = [];
  isAdmin: boolean = false;
  email: string = "";

  constructor(private http: HttpClient, private cookieService: CookieService, private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.getCookie();
    this.loadPublications();
    setTimeout(() => {
      if (this.isAdmin) {
        const btn_delpubli = document.getElementsByClassName("btn_delpubli");
        for (let i = 0; i < btn_delpubli.length; i++) {
          this.renderer.setStyle(btn_delpubli[i], 'visibility', 'visible');
        }
      }
    }, 300);
  }

  loadPublications() {
    const url = 'http://127.0.0.1:8000/api/publications/';
    const params = new HttpParams().set('search', 'Tous');
    const options = { params: params, withCredentials: true };
    this.http.get<Publication[]>(url, options)
      .subscribe(data => {
        this.publications = data;
      }
      );
  }

  deletePublication(id: number) {
    const url = 'http://127.0.0.1:8000/delete_publi/' + id + '/';
    const options = {
      withCredentials: true
    };
    this.http.get(url, options).subscribe();
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }

  getCookie() {
    let cookieValue = this.cookieService.get('isAdmin');
    if (cookieValue == "true") {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    };
    this.email = this.cookieService.get('email');
  }

  sortPubli() {
    let search = this.elementRef.nativeElement.querySelector('#search');
    const url = 'http://127.0.0.1:8000/api/publications/';
    const params = new HttpParams().set('search', search.value);
    const options = { params: params, withCredentials: true };
    this.http.get<Publication[]>(url, options)
      .subscribe(data => {
        this.publications = data;
      });
    setTimeout(() => {
      if (this.isAdmin) {
        const btn_delpubli = document.getElementsByClassName("btn_delpubli");
        for (let i = 0; i < btn_delpubli.length; i++) {
          this.renderer.setStyle(btn_delpubli[i], 'visibility', 'visible');
        }
      }
    }, 300);
  }



}


