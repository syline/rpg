import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteCharacterComponent } from './delete-character.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DeleteCharacterComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ]
})
export class DeleteCharacterModule { }
