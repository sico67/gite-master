import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-livret',
  template: `
    <div style="padding:16px;">
      <h3>Livret d'accueil</h3>
      <div *ngIf='reservation'>
        <p>Bonjour {{reservation.name}} — votre guide est ci-dessous.</p>
        <h4>Infos pratiques</h4>
        <p>Wifi: réseau / motdepasse</p>
        <h4>Guide</h4>
        <ul>
          <li *ngFor="let g of guides">{{g.title}}</li>
        </ul>
        <p><a href="https://g.page/r/CUSTOM_REVIEW_LINK" target="_blank">Laisser un avis</a></p>
      </div>
      <div *ngIf='!reservation'>
        <p>Accès général au livret. Scannez votre QR code pour y accéder depuis une réservation.</p>
      </div>
    </div>
  `
})
export class LivretComponent implements OnInit {
  reservation: any = null;
  guides = [];

  constructor(private route: ActivatedRoute, private ds: DataService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reservation = this.ds.getReservationById(id);
    }
    this.guides = this.ds.state?.guides || [{ title: 'Bienvenue' }, { title: 'Wifi & Accès' }];
  }
}
