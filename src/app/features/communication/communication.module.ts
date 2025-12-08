import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommunicationComponent } from './communication.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: CommunicationComponent }
];

@NgModule({
  declarations: [CommunicationComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class CommunicationModule {}
