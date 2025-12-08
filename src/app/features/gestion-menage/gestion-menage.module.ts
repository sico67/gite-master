import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MenageComponent } from './menage.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: MenageComponent }
];

@NgModule({
  declarations: [MenageComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class GestionMenageModule {}
