import { Component } from '@angular/core';
import { StripeService } from './stripe.service';

@Component({
  selector: 'app-paiement',
  template: `
    <div style="padding:16px;">
      <h3>Paiement (mode test)</h3>
      <label>Montant (€)<input type='number' [(ngModel)]='amount'></label>
      <button (click)='pay()'>Payer (simulate)</button>
    </div>
  `
})
export class PaiementComponent {
  amount = 10;
  constructor(private stripe: StripeService) {}

  pay() {
    this.stripe.payTest(this.amount).then(res => alert(res)).catch(e => alert('Erreur paiement'));
  }
}
