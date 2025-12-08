import { Component } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-communication',
  template: `
    <div style="padding:16px;">
      <h3>Communications</h3>
      <p>Templates automatiques :</p>
      <textarea rows="6" cols="60" [(ngModel)]="templateWelcome" placeholder="Message d'accueil"></textarea><br><br>
      <textarea rows="6" cols="60" [(ngModel)]="templateExit" placeholder="Message de sortie"></textarea><br><br>
      <button (click)="save()">Enregistrer templates</button>
    </div>
  `
})
export class CommunicationComponent {
  templateWelcome = 'Bonjour {prenom}, bienvenue ! Voici le livret: {lien_livret}';
  templateExit = 'Merci {prenom} d'être venu. Laissez-nous un avis: {lien_avis}';

  constructor(private ds: DataService) {
    const s = this.ds.getSettings();
    if (s.templates) {
      this.templateWelcome = s.templates.welcome || this.templateWelcome;
      this.templateExit = s.templates.exit || this.templateExit;
    }
  }

  save() {
    const s = this.ds.getSettings();
    this.ds.updateSettings({ templates: { welcome: this.templateWelcome, exit: this.templateExit }});
    alert('Templates sauvegardés');
  }
}
