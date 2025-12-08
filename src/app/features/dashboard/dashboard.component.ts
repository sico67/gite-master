import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { TaxeSejourService } from '../../core/services/taxe-sejour.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <div style="padding:16px;">
      <h2>Tableau de bord</h2>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:12px; margin-top:12px;">
        <app-widget title="Réservations" [value]="reservations.length" meta="Voir les réservations" route="/reservations"></app-widget>
        <app-widget title="Occupation" [value]="occupationPct + '%'" meta="Détails" route="/dashboard/occupation"></app-widget>
        <app-widget title="Revenus (mois)" [value]="monthlyRevenue + ' €'" meta="Voir les revenus" route="/dashboard/revenus"></app-widget>
        <app-widget title="Dépenses" [value]="finances.length" meta="Gérer les dépenses" route="/dashboard/depenses"></app-widget>
        <app-widget title="Ménage" [value]="menages.length" meta='Planning ménage' route="/menage"></app-widget>
        <app-widget title="Notes" [value]="notesCount" meta='Avis voyageurs' route="/reservations"></app-widget>
      </div>

      <section style="margin-top:24px;">
        <h3>Calendrier</h3>
        <div style="max-width:800px;">
          <app-calendar></app-calendar>
        </div>
      </section>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  reservations = [];
  finances = [];
  menages = [];
  notesCount = 0;
  occupationPct = 0;
  monthlyRevenue = 0;

  constructor(private ds: DataService, private taxe: TaxeSejourService, private router: Router) {}

  ngOnInit() {
    this.reservations = this.ds.getReservations();
    this.finances = this.ds.state?.finances || [];
    this.menages = this.ds.getMenages();
    this.notesCount = this.reservations.filter(r => r.note).length;
    this.occupationPct = this._calcOccupation();
    this.monthlyRevenue = this._calcMonthlyRevenue();
  }

  _calcOccupation() {
    // simple mock: percent = (reservations count mod 100)
    return Math.min(100, this.reservations.length * 7);
  }

  _calcMonthlyRevenue() {
    // sum of amounts in reservations for current month
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const revenues = this.reservations
      .filter(r => {
        const d = new Date(r.start);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((s, r) => s + (r.amount || 0), 0);
    return revenues.toFixed(2);
  }
}
