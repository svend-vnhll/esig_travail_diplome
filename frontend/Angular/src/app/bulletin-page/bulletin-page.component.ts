import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoopLoadingBulletin } from '../javascriptfun.js';

import { Cours } from '../interfaces/cours.js'
import { Horaire } from '../interfaces/horaire.js'
import { Note } from '../interfaces/note.js'

@Component({
  selector: 'app-bulletin-page',
  templateUrl: './bulletin-page.component.html',
  styleUrls: ['./bulletin-page.component.css']
})
export class BulletinPageComponent {

  constructor(private http: HttpClient, private elementRef: ElementRef, private cookieService: CookieService, private renderer: Renderer2) { }

  cours: Cours[] = [];
  notes: Note[] = [];
  modules: { nom: string; cours: Cours[] }[] = [];
  email: string = "";
  change: boolean = false;
  changesDict: { [key: string]: number } = {};

  ngOnInit() {
    this.email = this.cookieService.get('email');
    if (this.email == "") {
      window.location.href = "/login";
    }
    this.loadCours();
    this.loadNotes();
    setTimeout(() => {
      LoopLoadingBulletin(this.notes);
    }, 1000);
  }

  loadAll() {
    this.loadCours();
    this.loadNotes();
    this.changesDict = {};
    setTimeout(() => {
      LoopLoadingBulletin(this.notes);
    }, 1000);
  }

  editNote(elem: string) {
    let save_logo = this.elementRef.nativeElement.querySelector('#save_logo');
    this.changesDict[elem] = this.elementRef.nativeElement.querySelector('#' + elem).value;

    if (!this.change) {
      save_logo.src = "../assets/img/tosave.gif";
      save_logo.style.cursor = "pointer";
      this.change = !this.change;
    }
    LoopLoadingBulletin();
  }


  saveBulletin() {
    let save_logo = this.elementRef.nativeElement.querySelector('#save_logo');
    if (!(Object.keys(this.changesDict).length === 0) || (this.change)) {
      save_logo.src = "../assets/img/saved.png";
      save_logo.style.cursor = "default";
      this.change = !this.change;

      this.sendNotes();
      setTimeout(() => {
        this.loadAll();
      }, 1000);
    }
  }

  sendNotes() {
    const url = 'http://127.0.0.1:8000/change_bulletin/';
    const data = {
      notes: this.changesDict,
      eleve: this.email
    };

    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

    this.http.post(url, data, options)
      .subscribe(response => { });
  }

  loadCours() {
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;
    const url = 'http://127.0.0.1:8000/api/cours/';
    const params = new HttpParams().set('search', sem);
    const options = { params: params, withCredentials: true };
    this.http.get<Cours[]>(url, options)
      .subscribe(data => {
        this.cours = data;
        this.groupCoursByModule();
      });
  }

  loadNotes() {
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;
    const url = 'http://127.0.0.1:8000/api/notes/';
    const params = new HttpParams().set('search', sem).set('user', this.email);
    const options = { params: params, withCredentials: true };
    this.http.get<Note[]>(url, options)
      .subscribe(data => {
        this.notes = data;
      });
  }

  groupCoursByModule() {
    this.modules = [];
    this.cours.forEach(cours => {
      const existingModule = this.modules.find(m => m.nom === cours.module);
      if (existingModule) {
        existingModule.cours.push(cours);
      } else {
        this.modules.push({ nom: cours.module, cours: [cours] });
      }
    });
  }


}
