import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UpdateCharacterComponent } from './update-character.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TitleBarModule } from 'src/app/shared/components/title-bar/title-bar.module';

@NgModule({
  declarations: [UpdateCharacterComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,

    FlexLayoutModule,
    TitleBarModule,
  ]
})
export class UpdateCharacterModule { }
