import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FighterComponent } from './fighter.component';

@NgModule({
  declarations: [FighterComponent],
  exports: [FighterComponent],
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
  ]
})
export class FighterModule { }
