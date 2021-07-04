import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { TitleBarComponent } from './title-bar.component';

@NgModule({
  declarations: [
    TitleBarComponent
  ],
  exports: [
    TitleBarComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
  ]
})
export class TitleBarModule { }
