import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  template: `
    <div class="calendar">
      <div class="month">{{currentMonth}}</div>
      <div class="days">
        <div class="day" *ngFor="let d of days" (click)="onDayClick(d)">{{d.label}}</div>
      </div>
    </div>
  `,
  styles: [`
    .calendar { border:1px solid #eee; padding:12px; border-radius:8px; background:#fff; }
    .month{ font-weight:700; margin-bottom:8px;}
    .days{ display:grid; grid-template-columns: repeat(7,1fr); gap:6px;}
    .day{ padding:8px; border-radius:6px; background:#fafafa; text-align:center; cursor:pointer;}
    .day:hover{ transform:translateY(-2px); box-shadow:0 2px 6px rgba(0,0,0,.06); }
  `]
})
export class CalendarComponent implements OnInit {
  days = [];
  currentMonth = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const now = new Date();
    this.currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    // generate 30 days for demo
    this.days = Array.from({length:30}).map((_,i) => ({ label: i+1, date: new Date(now.getFullYear(), now.getMonth(), i+1).toISOString() }));
  }

  onDayClick(day) {
    // navigate to new reservation page with date prefilled
    this.router.navigate(['/reservations/new'], { queryParams: { date: day.date }});
  }
}
