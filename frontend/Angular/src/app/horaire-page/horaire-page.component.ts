import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoopLoadingHoraire } from '../javascriptfun.js';

import { Cours } from '../interfaces/cours.js'
import { Horaire } from '../interfaces/horaire.js'

@Component({
  selector: 'app-horaire-page',
  templateUrl: './horaire-page.component.html',
  styleUrls: ['./horaire-page.component.css']
})
export class HorairePageComponent {

  constructor(private http: HttpClient, private elementRef: ElementRef, private cookieService: CookieService, private renderer: Renderer2) { }

  email: string = "";
  cours: Cours[] = [];
  jours: any[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  heures: any[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
  horaires: Horaire[] = [];
  salles: any[] = ["302", "303", "304", "305", "306", "307", "308", "309", "310", "311", "312", "313", "314", "315", "316", "317", "318", "319"]

  ngOnInit() {
    this.email = this.cookieService.get('email');
    if (this.email == "") {
      window.location.href = "/login";
    }
    this.loadCours();
    this.loadHoraire();
  }

  loadAll() {
    this.loadCours();
    this.loadHoraire();
    setTimeout(() => {
      LoopLoadingHoraire(this.horaires);
    }, 1000);
  }

  loadCours() {
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;
    const url = 'http://127.0.0.1:8000/api/cours/';
    const params = new HttpParams().set('search', sem);
    const options = { params: params, withCredentials: true };
    this.http.get<Cours[]>(url, options)
      .subscribe(data => {
        this.cours = data;
      });
  }

  loadHoraire() {
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;
    const url = 'http://127.0.0.1:8000/api/horaires/';
    const params = new HttpParams().set('search', sem).set('user', this.email);
    const options = { params: params, withCredentials: true };
    this.http.get<Horaire[]>(url, options)
      .subscribe(data => {
        this.horaires = data;
      });
    setTimeout(() => {
      LoopLoadingHoraire(this.horaires);
    }, 1000);
  }

  changeHoraire(horaire: string) {
    let elem = this.elementRef.nativeElement.querySelector('#' + horaire + "_select");
    let salle_input = this.elementRef.nativeElement.querySelector('#' + horaire + "_salle");
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;

    if (elem.value != "") {
      this.renderer.setStyle(salle_input, 'visibility', 'visible');
    } else {
      this.renderer.setStyle(salle_input, 'visibility', 'hidden');
      salle_input.value = "";
    }

    const url = 'http://127.0.0.1:8000/edit/horaire/';
    const params = new HttpParams().set('horaire', horaire).set('cours', elem.value).set('eleve', this.email).set('semestre', sem).set('salle', "0");
    const options = { params: params, withCredentials: true };
    this.http.get(url, options).subscribe();
  }

  changeSalle(horaire: string) {
    let elem = this.elementRef.nativeElement.querySelector('#' + horaire + "_select");
    let salle_input = this.elementRef.nativeElement.querySelector('#' + horaire + "_salle");
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;

    const url = 'http://127.0.0.1:8000/edit/horaire/';
    const params = new HttpParams().set('horaire', horaire).set('cours', elem.value).set('eleve', this.email).set('semestre', sem).set('salle', salle_input.value);
    const options = { params: params, withCredentials: true };
    this.http.get(url, options).subscribe();
  }

}
