import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  constructor(private ds: DataService) {}

  sendWelcome(reservation) {
    const tpl = this.ds.getSettings().templates?.welcome || 'Bienvenue {prenom}';
    const message = tpl.replace('{prenom}', reservation.name).replace('{lien_livret}', '/livret/' + reservation.id);
    console.log('Simulated send welcome:', message);
    // Integration: SendGrid/Twilio calls would go here
  }

  sendExit(reservation) {
    const tpl = this.ds.getSettings().templates?.exit || 'Merci {prenom}';
    const message = tpl.replace('{prenom}', reservation.name).replace('{lien_avis}', 'https://g.page/r/CUSTOM_REVIEW_LINK');
    console.log('Simulated send exit:', message);
  }
}
