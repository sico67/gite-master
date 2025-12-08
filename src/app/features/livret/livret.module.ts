import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LivretComponent } from './livret.component';

const routes: Routes = [
  { path: '', component: LivretComponent },
  { path: ':id', component: LivretComponent }
];

@NgModule({
  declarations: [LivretComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class LivretModule {}
