import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaiementComponent } from './paiement.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: PaiementComponent }
];

@NgModule({
  declarations: [PaiementComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class PaiementModule {}
