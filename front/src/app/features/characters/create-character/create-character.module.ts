import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CreateCharacterComponent } from './create-character.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [CreateCharacterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
  ]
})
export class CreateCharacterModule { }
