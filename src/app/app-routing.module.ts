import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CalendarComponent } from './features/calendar/calendar.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'reservations', loadChildren: () => import('./features/reservations/reservations.module').then(m => m.ReservationsModule) },
  { path: 'menage', loadChildren: () => import('./features/gestion-menage/gestion-menage.module').then(m => m.GestionMenageModule) },
  { path: 'livret', loadChildren: () => import('./features/livret/livret.module').then(m => m.LivretModule) },
  { path: 'communication', loadChildren: () => import('./features/communication/communication.module').then(m => m.CommunicationModule) },
  { path: 'paiement', loadChildren: () => import('./features/paiement/paiement.module').then(m => m.PaiementModule) },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
