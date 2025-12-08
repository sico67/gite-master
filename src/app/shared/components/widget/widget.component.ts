import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-widget',
  template: `
    <div class="widget" (click)="navigate()" role="button" tabindex="0">
      <div class="title">{{title}}</div>
      <div class="value">{{value}}</div>
      <div class="meta">{{meta}}</div>
    </div>
  `,
  styles: [`
    .widget { border-radius:8px; padding:12px; box-shadow:0 1px 3px rgba(0,0,0,.08); cursor:pointer; background:white; }
    .title{ font-weight:600; }
    .value{ font-size:1.4rem; margin-top:6px;}
    .meta{ color:#666; font-size:12px; margin-top:8px;}
  `]
})
export class WidgetComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() meta = '';
  @Input() route = '';

  constructor(private router: Router) {}

  navigate() {
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }
}
