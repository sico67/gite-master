import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { TaxeSejourService } from '../../core/services/taxe-sejour.service';

@Component({
  selector: 'app-reservations-new',
  template: `
    <div style="padding:16px;">
      <h3>Nouvelle réservation</h3>
      <form (ngSubmit)='save()'>
        <label>Nom<br><input [(ngModel)]='model.name' name='name' required></label><br><br>
        <label>Début<br><input type='date' [(ngModel)]='model.start' name='start'></label><br><br>
        <label>Fin<br><input type='date' [(ngModel)]='model.end' name='end'></label><br><br>
        <label>Adultes<br><input type='number' [(ngModel)]='model.adults' name='adults'></label><br><br>
        <label>Montant (€)<br><input type='number' [(ngModel)]='model.amount' name='amount'></label><br><br>
        <div *ngIf='taxe'>Taxe de séjour: {{taxe}} €</div><br>
        <button type='submit'>Enregistrer</button>
      </form>
    </div>
  `
})
export class ReservationsNewComponent implements OnInit {
  model: any = { name: '', start: '', end: '', adults: 1, amount: 0 };
  taxe = 0;

  constructor(private route: ActivatedRoute, private ds: DataService, private taxeService: TaxeSejourService, private router: Router) {}

  ngOnInit() {
    const date = this.route.snapshot.queryParamMap.get('date');
    if (date) {
      // set start date from query param
      const d = new Date(date);
      this.model.start = d.toISOString().slice(0,10);
      const end = new Date(d);
      end.setDate(end.getDate() + 1);
      this.model.end = end.toISOString().slice(0,10);
    }
    this._calcTaxe();
  }

  _calcTaxe() {
    try {
      const nights = this._computeNights();
      this.taxe = this.taxeService.calculate({ nights, adults: this.model.adults });
    } catch(e) { this.taxe = 0; }
  }

  _computeNights() {
    if (!this.model.start || !this.model.end) return 1;
    const s = new Date(this.model.start);
    const e = new Date(this.model.end);
    const diff = Math.max(1, Math.round((e.getTime() - s.getTime())/(1000*60*60*24)));
    return diff;
  }

  save() {
    this.model.nights = this._computeNights();
    this.model.taxe = this.taxeService.calculate(this.model);
    const created = this.ds.addReservation(this.model);
    // send auto messages via communication module would be triggered here
    this.router.navigate(['/reservations']);
  }
}
