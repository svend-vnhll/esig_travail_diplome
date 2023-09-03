import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoopLoadingBulletin } from '../javascriptfun.js';
import { getISOWeek, startOfWeek, endOfWeek, format, addWeeks, subWeeks, addDays, parse, getDay } from 'date-fns';

import { Semestre } from '../interfaces/semestre.js'
import { Horaire } from '../interfaces/horaire.js';
import { Absence } from '../interfaces/absence.js';
import { he } from 'date-fns/locale';

@Component({
  selector: 'app-absence-page',
  templateUrl: './absence-page.component.html',
  styleUrls: ['./absence-page.component.css']
})
export class AbsencePageComponent {
  currentWeek: number;
  today: Date = new Date();
  weekStartDate: Date = new Date();
  weekEndDate: Date = new Date();
  str_today: string = "";
  str_weekStartDate: string = "";
  str_weekEndDate: string = "";
  days_fr: string[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  formattedWeekDays: { dayName: string, date: string }[] = [];
  heures: any[] = ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H08", "H09", "H10", "H11", "H12"]
  change: boolean = false;
  email: string = "";
  semestres: Semestre[] = [];
  horaires: Horaire[] = [];
  absences: Absence[] = [];
  heureContent: { [key: string]: string } = {};
  stats: { [key: string]: string } = {};


  constructor(private http: HttpClient, private elementRef: ElementRef, private cookieService: CookieService, private renderer: Renderer2) {
    this.currentWeek = getISOWeek(this.today);
    this.str_today = format(this.today, 'dd.MM')
    this.calculWeekDates();
    this.calculFormDays();
  }

  calculWeekDates() {
    this.weekStartDate = startOfWeek(this.today, { weekStartsOn: 1 });
    this.weekEndDate = endOfWeek(this.today, { weekStartsOn: 1 });
    this.str_weekStartDate = format(this.weekStartDate, 'dd.MM')
    this.str_weekEndDate = format(this.weekEndDate, 'dd.MM')
  }

  calculFormDays() {
    this.formattedWeekDays = [];
    for (let i = 0; i < 5; i++) {
      const day = addWeeks(this.weekStartDate, 0);
      const formatDate = format(addDays(day, i), 'dd.MM');
      this.formattedWeekDays.push({ dayName: this.days_fr[i], date: formatDate });
    }
  }

  navPrevWeek() {
    this.today = subWeeks(this.today, 1);
    this.currentWeek = this.currentWeek - 1;
    this.calculWeekDates();
    this.calculFormDays();
    this.ngOnInit();
  }

  navNextWeek() {
    this.today = addWeeks(this.today, 1);
    this.currentWeek = this.currentWeek + 1;
    this.calculWeekDates();
    this.calculFormDays();
    this.ngOnInit();
  }

  navCurrentWeek() {
    this.today = new Date();
    this.currentWeek = getISOWeek(this.today);
    this.calculWeekDates();
    this.calculFormDays();
    this.ngOnInit();
  }

  formatDate(date: Date): string {
    return format(date, 'dd.MM');
  }

  ngOnInit() {
    this.email = this.cookieService.get('email');
    if (this.email == "") {
      window.location.href = "/login";
    }
    this.getSemestreEleve();
    this.getCoursEleve();
    this.getAbsencesEleve();
    setTimeout(() => {
      this.setAbsencesEleve();
    }, 1000);
    this.setStats();

  }

  getSemestreEleve() {
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;
    const url = 'http://127.0.0.1:8000/api/semestres/';
    const params = new HttpParams().set('search', sem).set('user', this.email);
    const options = { params: params, withCredentials: true };
    this.http.get<Semestre[]>(url, options)
      .subscribe(data => {
        this.semestres = data;
      });

    setTimeout(() => {
      this.semestres.forEach(s => {
        if (s.numSemestre === sem) {
          this.elementRef.nativeElement.querySelector('#datedeb_input').value = s.dateDebut;
          this.elementRef.nativeElement.querySelector('#datefin_input').value = s.dateFin;
        }
      });
    }, 1000);



  }

  editingSemestre(input: string) {
    let save_logo = this.elementRef.nativeElement.querySelector('#save_logo');
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;
    if (input == "s") {
      this.semestres.forEach(s => {
        if (s.numSemestre === sem) {
          this.elementRef.nativeElement.querySelector('#datedeb_input').value = s.dateDebut;
          this.elementRef.nativeElement.querySelector('#datefin_input').value = s.dateFin;
        }
      });
    } else {
      if (!this.change) {
        save_logo.src = "../assets/img/tosave.gif";
        save_logo.style.cursor = "pointer";
        this.change = !this.change;
        const url = 'http://127.0.0.1:8000/change_latest/';

        const data = {
          semestre: sem,
          eleve: this.email,
        };
        const options = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          withCredentials: true
        };
        this.http.post(url, data, options).subscribe;

      }
    }
  }

  saveSemestre() {
    let save_logo = this.elementRef.nativeElement.querySelector('#save_logo');
    if (this.change) {
      save_logo.src = "../assets/img/saved.png";
      save_logo.style.cursor = "default";
      this.change = !this.change;

      const url = 'http://127.0.0.1:8000/save_semestre/';
      let sem = this.elementRef.nativeElement.querySelector('#semestre').value;

      const data = {
        semestre: sem,
        eleve: this.email,
        date_deb: this.elementRef.nativeElement.querySelector('#datedeb_input').value,
        date_fin: this.elementRef.nativeElement.querySelector('#datefin_input').value
      };

      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
      };

      this.http.post(url, data, options).subscribe;
    }
  }

  inputAbsence(detail: string) {
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;
    const url = 'http://127.0.0.1:8000/edit_absence/';
    const data = {
      semestre: sem,
      semaine: this.currentWeek,
      eleve: this.email,
      details: detail
    };
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    this.http.post(url, data, options).subscribe(data => {
    });
  }

  getCoursEleve() {
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;
    const url = 'http://127.0.0.1:8000/api/horaires/';
    const params = new HttpParams().set('search', sem).set('user', this.email);
    const options = { params: params, withCredentials: true };
    this.http.get<Horaire[]>(url, options)
      .subscribe(data => {
        this.horaires = data;
      });
    setTimeout(() => {
      this.horaires.forEach(item => {
        const codeCours = item.codeCours;
        const jourBackend = item.codeHoraire.slice(0, 3);
        const heureBackend = item.codeHoraire.slice(3);

        this.formattedWeekDays.forEach(day => {
          this.heures.forEach(heure => {
            const key = `${day.dayName}_${heure}`;
            if (jourBackend === day.dayName.toLowerCase().slice(0, 3) && heureBackend === heure.slice(1)) {
              this.heureContent[key] = codeCours;
            }
          });
        });
      });
    }, 1000);
  }

  getAbsencesEleve() {
    let sem = this.elementRef.nativeElement.querySelector('#semestre').value;
    const url = 'http://127.0.0.1:8000/api/absences/';
    const params = new HttpParams().set('semestre', sem).set('user', this.email);
    const options = { params: params, withCredentials: true };
    this.http.get<Absence[]>(url, options)
      .subscribe(data => {
        this.absences = data;
      });
  }

  setAbsencesEleve() {
    let nbabs = 0;
    this.horaires.forEach(item => {
      this.formattedWeekDays.forEach(day => {
        this.heures.forEach(heure => {
          this.absences.forEach(absence => {
            if (absence.dateAbs === day.date && heure === absence.horaire) {
              let inputname = day.dayName + "_" + day.date + "_" + heure;
              this.elementRef.nativeElement.querySelector(`input[name="${inputname}"][value="abs_${absence.type}"]`).checked = true;
              nbabs++;
            }
          })
        });
      });
    });
  }

  setStats() {
    const url = 'http://127.0.0.1:8000/get_stats_absences/';
    const data = {
      email: this.email,
      semestre: this.elementRef.nativeElement.querySelector('#semestre').value
    };
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true };

    this.http.post(url, data, options)
      .subscribe((response: any) => {
        const total_heures = response.total_heures;
        const absences = response.absences;
        const abs_nexc = response.abs_nexc;
        const abs_exc = response.abs_exc;
        const pourcentage = response.pourcentage;

        this.stats["total_heures"] = total_heures;
        this.stats["absences"] = absences;
        this.stats["abs_nexc"] = abs_nexc;
        this.stats["abs_exc"] = abs_exc;
        this.stats["pourcentage"] = pourcentage;
      });
  }
}
