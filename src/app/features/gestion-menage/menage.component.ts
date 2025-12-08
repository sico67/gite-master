import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-menage',
  template: `
    <div style="padding:16px;">
      <h3>Planning ménage</h3>
      <form (ngSubmit)="add()">
        <label>Intervenant<br><input [(ngModel)]="model.person" name="person"></label><br><br>
        <label>Date<br><input type="date" [(ngModel)]="model.date" name="date"></label><br><br>
        <label>Réservation (id)<br><input [(ngModel)]="model.reservationId" name="reservationId"></label><br><br>
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        <li *ngFor="let m of menages">
          {{m.date}} — {{m.person}} — Réf: {{m.reservationId || '—'}}
        </li>
      </ul>
    </div>
  `
})
export class MenageComponent implements OnInit {
  menages = [];
  model: any = {};

  constructor(private ds: DataService) {}

  ngOnInit() {
    this.menages = this.ds.getMenages();
  }

  add() {
    if (!this.model.date || !this.model.person) return;
    this.ds.addMenage(this.model);
    this.model = {};
    this.menages = this.ds.getMenages();
  }
}
