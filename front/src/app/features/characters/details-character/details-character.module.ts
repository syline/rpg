import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DetailsCharacterComponent } from './details-character.component';



@NgModule({
  declarations: [
    DetailsCharacterComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    FlexLayoutModule,
  ]
})
export class DetailsCharacterModule { }
