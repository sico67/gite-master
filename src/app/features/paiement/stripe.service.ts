import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StripeService {
  async payTest(amount: number) {
    console.log('Simulated Stripe payment of', amount);
    // In production, call backend to create payment intent and confirm with stripe.js
    return Promise.resolve('Paiement simulé réussi: ' + amount + ' € (mode test)');
  }
}
