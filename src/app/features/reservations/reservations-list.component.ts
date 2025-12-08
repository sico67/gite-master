import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservations-list',
  template: `
    <div style="padding:16px;">
      <h3>Réservations</h3>
      <button (click)="create()">Nouvelle réservation</button>
      <ul>
        <li *ngFor="let r of reservations" (click)="open(r)" style="cursor:pointer; padding:8px; border-bottom:1px solid #eee;">
          <strong>{{r.name}}</strong> — {{r.start | date}} → {{r.end | date}} — {{r.amount}} €
        </li>
      </ul>
    </div>
  `
})
export class ReservationsListComponent implements OnInit {
  reservations = [];
  constructor(private ds: DataService, private router: Router) {}

  ngOnInit() {
    this.reservations = this.ds.getReservations();
  }

  create() {
    this.router.navigate(['/reservations/new']);
  }

  open(r) {
    this.router.navigate(['/reservations', r.id]);
  }
}
