import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { YesNoPipe } from 'src/app/shared/pipes/yes-no.pipe';
import { CharactersRoutingModule } from './characters-routing.module';
import { CharactersComponent } from './characters.component';
import { CreateCharacterModule } from './create-character/create-character.module';

@NgModule({
  declarations: [
    CharactersComponent,
    YesNoPipe,
  ],
  imports: [
    CommonModule,
    CharactersRoutingModule,
    MatTableModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,

    CreateCharacterModule,
  ]
})
export class CharactersModule { }
