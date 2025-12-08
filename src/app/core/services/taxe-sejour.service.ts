import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class TaxeSejourService {
  constructor(private ds: DataService) {}

  calculate(reservation) {
    // Example: taux par nuit * nombre de nuits * adultes
    const taux = this.ds.getSettings().taxeSejourTaux || 0;
    const nights = reservation.nights || 1;
    const adults = reservation.adults || 1;
    const amount = parseFloat((taux * nights * adults).toFixed(2));
    return amount;
  }
}
