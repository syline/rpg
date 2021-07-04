import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CharactersRoutingModule } from './characters-routing.module';
import { CharactersComponent } from './characters.component';
import { CreateCharacterModule } from './create-character/create-character.module';
import { DeleteCharacterModule } from './delete-character/delete-character.module';
import { DetailsCharacterModule } from './details-character/details-character.module';
import { FightModule } from './fight/fight.module';
import { UpdateCharacterModule } from './update-character/update-character.module';

@NgModule({
  declarations: [
    CharactersComponent,
  ],
  imports: [
    CommonModule,
    CharactersRoutingModule,
    MatTableModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,

    CreateCharacterModule,
    UpdateCharacterModule,
    DeleteCharacterModule,
    FightModule,
    DetailsCharacterModule,
  ]
})
export class CharactersModule { }
