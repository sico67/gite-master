import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReservationsListComponent } from './reservations-list.component';
import { ReservationsNewComponent } from './reservations-new.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ReservationsListComponent },
  { path: 'new', component: ReservationsNewComponent },
  { path: ':id', component: ReservationsListComponent }
];

@NgModule({
  declarations: [ReservationsListComponent, ReservationsNewComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class ReservationsModule {}
