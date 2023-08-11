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
  formattedWeekDays: string[] = [];
  change: boolean = false;
  email: string = "";

  constructor(private http: HttpClient, private elementRef: ElementRef, private cookieService: CookieService, private renderer: Renderer2) {
    this.currentWeek = getISOWeek(this.today);
    this.str_today = format(this.today, 'dd.MM')
    this.calculWeekDates();
    this.calculFormDays();
  }

  calculWeekDates() {
    console.log(this.currentWeek);
    this.weekStartDate = startOfWeek(this.today, { weekStartsOn: 1 });
    this.weekEndDate = endOfWeek(this.today, { weekStartsOn: 1 });
    this.str_weekStartDate = format(this.weekStartDate, 'dd.MM')
    this.str_weekEndDate = format(this.weekEndDate, 'dd.MM')
  }

  calculFormDays() {
    this.formattedWeekDays = [];
    for (let i = 0; i < 5; i++) {
      const day = addDays(this.weekStartDate, i);
      this.formattedWeekDays.push(format(day, 'EEEE dd.MM'));
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
