import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersComponent } from './characters.component';
import { CharactersRoutingModule } from './characters-routing.module';
import { MatTableModule } from '@angular/material/table';
import { YesNoPipe } from 'src/app/shared/pipes/yes-no.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';

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
  ]
})
export class CharactersModule { }
