import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoopLoadingBulletin } from '../javascriptfun.js';
import { getISOWeek, startOfWeek, endOfWeek, format, addWeeks, subWeeks, addDays } from 'date-fns';

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
  heures: any[] = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12"]
  change: boolean = false;
  email: string = "";

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
      const day = addWeeks(this.weekStartDate, this.currentWeek);
      const formatDate = format(addDays(day, i), 'dd.MM');
      this.formattedWeekDays.push({ dayName: this.days_fr[i], date: formatDate });
    }
  }

  navPrevWeek() {
    this.today = subWeeks(this.today, 1);
    this.currentWeek = this.currentWeek - 1;
    this.calculWeekDates();
    this.calculFormDays();
  }

  navNextWeek() {
    this.today = addWeeks(this.today, 1);
    this.currentWeek = this.currentWeek + 1;
    this.calculWeekDates();
    this.calculFormDays();
  }

  navCurrentWeek() {
    this.today = new Date();
    this.currentWeek = getISOWeek(this.today);
    this.calculWeekDates();
    this.calculFormDays();
  }

  formatDate(date: Date): string {
    return format(date, 'dd.MM');
  }

  ngOnInit() {
    this.email = this.cookieService.get('email');
    if (this.email == "") {
      window.location.href = "/login";

    }
  }

  editingSemestre() {
    let save_logo = this.elementRef.nativeElement.querySelector('#save_logo');

    if (!this.change) {
      save_logo.src = "../assets/img/tosave.gif";
      save_logo.style.cursor = "pointer";
      this.change = !this.change;
    }
  }

  saveSemestre() {
    let save_logo = this.elementRef.nativeElement.querySelector('#save_logo');
    if (this.change) {
      save_logo.src = "../assets/img/saved.png";
      save_logo.style.cursor = "default";
      this.change = !this.change;
    }

  }
}
