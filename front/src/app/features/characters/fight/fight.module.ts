import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FighterModule } from 'src/app/shared/components/fighter/fighter.module';
import { FightComponent } from './fight.component';



@NgModule({
  declarations: [
    FightComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,

    FighterModule,
  ]
})
export class FightModule { }
