import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UpdateCharacterComponent } from './update-character.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [UpdateCharacterComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,

    FlexLayoutModule,
  ]
})
export class UpdateCharacterModule { }
