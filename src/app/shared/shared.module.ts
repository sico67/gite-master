import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WidgetComponent } from './components/widget/widget.component';

@NgModule({
  declarations: [WidgetComponent],
  imports: [CommonModule, RouterModule],
  exports: [WidgetComponent, CommonModule, RouterModule]
})
export class SharedModule {}
