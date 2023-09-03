import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ShowCoursPanel } from '../javascriptfun.js';
import { ShowPubliPanel } from '../javascriptfun.js';
import { showErrorMessage } from '../javascriptfun.js';
import { showInfoMessage } from '../javascriptfun.js';
import { ClearInputs } from '../javascriptfun.js';
import { Cours } from '../interfaces/cours.js'

interface CheckInputs {
  response: String;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private elementRef: ElementRef, private renderer: Renderer2) { }

  cours: Cours[] = [];
  isAdmin: Boolean = false;
  email: String = "";
  isEditing: number = 0;

  cou_nom: string = "";
  cou_code: string = "";
  cou_module: string = "";
  cou_semestre: number = 1;
  cou_coefficient: number = 1;

  titre_publi: string = "";
  contenu_publi: string = "";

  ngOnInit() {
    this.getCookie();
    this.loadCours();
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

  showCours() {
    ShowCoursPanel();
  }

  showPubli() {
    ShowPubliPanel();
  }

  public closeError() {
    showErrorMessage("");
  }

  saveCours() {
    const url = 'http://127.0.0.1:8000/ajouter_cours/' + this.isEditing + '/';
    const data = {
      cou_nom: this.cou_nom,
      cou_code: this.cou_code,
      cou_module: this.cou_module,
      cou_semestre: this.cou_semestre,
      cou_coefficient: this.cou_coefficient,
    };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    this.http.post<CheckInputs>(url, data, options)
      .subscribe(res => {
        const response = res.response;

        if (response == "already_exists") {
          showErrorMessage("Il semblerait qu'un cours similaire existe déjà dans la base.");
        } else if (response == "invalid_input") {
          showErrorMessage("Un ou plusieurs champs ne sont pas remplis !");
        } else {
          showErrorMessage("");
          this.router.navigate(['/admin']);
          setTimeout(() => {
            if (this.isEditing == 0) {
              showInfoMessage("Cours ajouté !");
            } else {
              showInfoMessage("Cours modifié !");
              this.isEditing = 0;
            }
            window.location.href = '/admin';
          }, 1000);
        }
      });
  }

  loadCours() {
    const url = 'http://127.0.0.1:8000/api/cours/';
    const params = new HttpParams().set('search', '0');
    const options = { params: params, withCredentials: true };
    this.http.get<Cours[]>(url, options)
      .subscribe(data => {
        this.cours = data;
      });
  }

  deleteCours(id_cours: number) {
    const url = 'http://127.0.0.1:8000/delete_cours/' + id_cours + "/";
    const options = {
      withCredentials: true
    };
    this.http.get(url, options).subscribe();
    window.location.href = '/admin';
  }


  editCours(id_cours) {
    this.isEditing = id_cours;
    let title = this.elementRef.nativeElement.querySelector('#title_creer_cours');
    let input_nom = this.elementRef.nativeElement.querySelector('#cou_nom');
    let input_code = this.elementRef.nativeElement.querySelector('#cou_code');
    let input_module = this.elementRef.nativeElement.querySelector('#cou_module');
    let input_semestre = this.elementRef.nativeElement.querySelector('#cou_semestre');
    let input_coefficient = this.elementRef.nativeElement.querySelector('#cou_coefficient');

    let get_nom = this.elementRef.nativeElement.querySelector('#nom' + id_cours).textContent;
    let get_code = this.elementRef.nativeElement.querySelector('#code' + id_cours).textContent;
    let get_module = this.elementRef.nativeElement.querySelector('#module' + id_cours).textContent;
    let get_semestre = this.elementRef.nativeElement.querySelector('#semestre' + id_cours).textContent;
    let get_coefficient = this.elementRef.nativeElement.querySelector('#coefficient' + id_cours).textContent;

    this.renderer.setProperty(title, 'innerText', 'Modifier cours');
    this.renderer.setProperty(input_nom, 'value', get_nom);
    this.cou_nom = get_nom;
    this.renderer.setProperty(input_code, 'value', get_code);
    this.cou_code = get_code;
    this.renderer.setProperty(input_module, 'value', get_module);
    this.cou_module = get_module;
    this.renderer.setProperty(input_semestre, 'value', get_semestre);
    this.cou_semestre = get_semestre;
    this.renderer.setProperty(input_coefficient, 'value', get_coefficient);
    this.cou_coefficient = get_coefficient;
  }

  savePubli() {
    const url = 'http://127.0.0.1:8000/ajouter_publi/';
    let sel_tag = this.elementRef.nativeElement.querySelector('#sel_tag').value;
    const data = {
      titre_publi: this.titre_publi,
      contenu_publi: this.contenu_publi,
      type_publi: sel_tag,
      auteur_publi: this.cookieService.get('email'),
    };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    this.http.post<CheckInputs>(url, data, options)
      .subscribe(res => {
        const response = res.response;

        if (response == "invalid_input") {
          showErrorMessage("Un ou plusieurs champs ne sont pas remplis !");
        } else {
          showErrorMessage("");
          setTimeout(() => {
            showInfoMessage("Publication ajoutée !");
          }, 1000);
        }
      });
    this.clearInputs()
  }

  clearInputs() {
    if (this.isEditing != 0) {
      this.isEditing = 0;
    }
    const element = this.elementRef.nativeElement.querySelector('#title_creer_cours');
    this.renderer.setProperty(element, 'innerText', 'Créer un cours');
    ClearInputs()
  }
}
